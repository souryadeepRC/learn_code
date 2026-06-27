import { generateTokens, signRefreshToken } from '@/lib/auth/jwt';
import { prismaUsers } from '@/lib/prisma-users';
import { NextRequest, NextResponse } from 'next/server';
//import { GoogleOAuth } from '@/lib/auth/oauth/google';
import { GithubOAuth } from '@/lib/auth/oauth/github';
import { HTTP_STATUS } from '@/root/src/constants/api';
import {
  generatePseudoEmail,
  isPseudoEmail,
} from '@/root/src/lib/auth/oauth/utils';
import { APIResponse } from '@/root/src/utils/api';
//import { LinkedInOAuth } from '@/lib/auth/oauth/linkedin';

const providers = {
  //google: new GoogleOAuth(),
  github: new GithubOAuth(),
  //linkedin: new LinkedInOAuth(),
};

export async function GET(
  req: NextRequest,
  { params }: { params: { provider: string } }
) {
  try {
    const returnTo = req.cookies.get('oauth_return_to')?.value || '/';

    const redirectWithError = (message: string) => {
      console.error('OAuth Failed:', message);
      const url = new URL(returnTo, req.url);
      url.searchParams.set('error', 'OAuth_Failed');
      return NextResponse.redirect(url);
    };

    console.log({ req, params });
    console.log({ nextUrl: req.nextUrl });
    const resData = req.nextUrl.searchParams;
    console.log({ resData });

    if (resData.get('error')) {
      return redirectWithError(
        resData.get('error_description') || 'Unknown error'
      );
    }

    const paramDetails = await params;
    const provider = paramDetails.provider.toLowerCase();
    const code = req.nextUrl.searchParams.get('code');
    const state = req.nextUrl.searchParams.get('state');

    // Validate code and state
    if (!code || !state) {
      return redirectWithError('Missing code or state');
    }

    // Verify CSRF token
    const storedState = req.cookies.get(`oauth_state_${provider}`)?.value;
    if (storedState !== state) {
      return redirectWithError('Invalid state parameter');
    }

    if (!providers[provider as keyof typeof providers]) {
      return redirectWithError('Invalid provider');
    }

    const oauthProvider = providers[provider as keyof typeof providers];

    // Step 1: Exchange code for token
    const tokenData = await oauthProvider.exchangeCodeForToken(code);
    // Step 2: Get user info
    const userInfo = await oauthProvider.getUserInfo(tokenData.access_token);

    // Step 3: Get email (might be in additional API call)
    // if (!userInfo.email) {
    //   console.log(`⚠️  Provider ${provider} didn't return email`);

    //   // Try to fetch email from provider if available
    //   if (typeof oauthProvider.getUserEmail === 'function') {
    //     try {
    //       userInfo.email = await oauthProvider.getUserEmail(
    //         tokenData.access_token
    //       );
    //       console.log(
    //         `✅ Fetched email from additional API: ${userInfo.email}`
    //       );
    //     } catch (error) {
    //       console.log(`❌ Could not fetch email, will use pseudo-email`);
    //     }
    //   }
    // }

    // Step 4: Generate pseudo-email if real email is missing
    const emailToUse =
      userInfo.email ||
      generatePseudoEmail(provider, userInfo.id, userInfo.name);

    // console.log({
    //   provider,
    //   providerId: userInfo.id,
    //   email: emailToUse,
    //   isPseudo: isPseudoEmail(emailToUse),
    //   hasPhone: !!userInfo.phoneNumber,
    // });

    // Step 5: Find existing user
    let user = await prismaUsers.user.findFirst({
      where: {
        OR: [
          { email: emailToUse },
          // If no email, try to find by provider + ID
          ...(isPseudoEmail(emailToUse)
            ? [
                {
                  accounts: {
                    some: {
                      provider,
                      providerAccountId: userInfo.id.toString(),
                    },
                  },
                },
              ]
            : []),
        ],
      },
      include: { accounts: true },
    });

    // Step 6: Create user if doesn't exist

    if (!user) {
      user = await prismaUsers.user.create({
        data: {
          email: emailToUse,
          phoneNumber: userInfo.phoneNumber || null,
          //name: userInfo.name,
          // image: userInfo.picture || userInfo.avatar_url,
        },
        include: {
          accounts: true, // ✅ NOW accounts is included!
        },
      });
      // } else if (!user.image) {
      //   // Update image if not set
      //   user = await prismaUsers.user.update({
      //     where: { id: user.id },
      //     data: { image: userInfo.image },
      //   });
    } else {
      // Update user info if incomplete
      const updateData: any = {};

      if (!user.phoneNumber && userInfo.phoneNumber) {
        updateData.phoneNumber = userInfo.phoneNumber;
      }

      if (Object.keys(updateData).length > 0) {
        user = await prismaUsers.user.update({
          where: { id: user.id },
          data: updateData,
          include: { accounts: true },
        });
      }
    }
    if (!user) {
      return APIResponse.send(HTTP_STATUS.BAD_REQUEST).json({
        message: 'No User Found',
      });
    }
    // Step 7: Create or update OAuth account
    const existingAccount = user.accounts.find(
      (a) =>
        a.provider === provider &&
        a.providerAccountId === userInfo.id.toString()
    );
    if (!existingAccount) {
      await prismaUsers.account.create({
        data: {
          userId: user.id,
          provider,
          providerAccountId: userInfo.id.toString(),
          email: userInfo.email || null, // Store real email if available
          phoneNumber: userInfo.phoneNumber || null,
          name: userInfo.name,
          //image: userInfo.picture || userInfo.avatar_url,
          accessToken: tokenData.access_token,
          refreshToken: tokenData.refresh_token || null,
          expiresAt: tokenData.expires_in
            ? Math.floor(Date.now() / 1000) + tokenData.expires_in
            : null,
          tokenType: tokenData.token_type,
        },
      });
    } else {
      // Update existing account
      await prismaUsers.account.update({
        where: { id: existingAccount.id },
        data: {
          accessToken: tokenData.access_token,
          refreshToken: tokenData.refresh_token || null,
          expiresAt: tokenData.expires_in
            ? Math.floor(Date.now() / 1000) + tokenData.expires_in
            : null,
        },
      });
    }

    // // Step 4: Create or update OAuth account
    // await prismaUsers.account.upsert({
    //   where: {
    //     provider_providerAccountId: {
    //       provider,
    //       providerAccountId: userInfo.id.toString(),
    //     },
    //   },
    //   create: {
    //     userId: user.id,
    //     provider,
    //     providerAccountId: userInfo.id.toString(),
    //     accessToken: tokenData.access_token,
    //     refreshToken: tokenData.refresh_token || null,
    //     expiresAt: tokenData.expires_in
    //       ? Math.floor(Date.now() / 1000) + tokenData.expires_in
    //       : null,
    //     tokenType: tokenData.token_type,
    //     scope: req.nextUrl.searchParams.get('scope') || undefined,
    //   },
    //   update: {
    //     accessToken: tokenData.access_token,
    //     refreshToken: tokenData.refresh_token || undefined,
    //     expiresAt: tokenData.expires_in
    //       ? Math.floor(Date.now() / 1000) + tokenData.expires_in
    //       : undefined,
    //   },
    // });

    // Step 5: Generate JWT tokens
    const accessToken = generateTokens(user.id, user.email ?? '');
    const refreshToken = signRefreshToken(user.id);

    // Step 6: Store session
    await prismaUsers.session.create({
      data: {
        userId: user.id,
        token: refreshToken,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        ipAddress: req.headers.get('x-forwarded-for') || '',
        userAgent: req.headers.get('user-agent') || '',
      },
    });

    // Step 7: Redirect to frontend without tokens in url
    const redirectUrl = new URL('/dashboard', req.url);
    const response = NextResponse.redirect(redirectUrl);

    // Set accessToken in cookie (httpOnly for security)
    response.cookies.set('accessToken', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 15 * 60, // 15 mins
    });

    response.cookies.set('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    // Clear OAuth state cookies
    response.cookies.delete(`oauth_state_${provider}`);
    response.cookies.delete('oauth_return_to');

    return response;
  } catch (error) {
    console.error('OAuth callback error:', error);
    const returnTo = req.cookies.get('oauth_return_to')?.value || '/';
    const errorUrl = new URL(returnTo, req.url);
    errorUrl.searchParams.set('error', 'OAuth_Failed');
    return NextResponse.redirect(errorUrl);
  }
}
