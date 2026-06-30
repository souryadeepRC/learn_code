import { generateTokens } from '@/lib/auth/jwt';
import { prismaUsers } from '@/lib/prisma-users';
import { HTTP_STATUS } from '@/root/src/constants/api';
import { OAuthProviders } from '@/root/src/constants/Auth';
import {
  generatePseudoEmail,
  isPseudoEmail,
} from '@/root/src/lib/auth/oauth/utils';
import { APICallbackParams, OAuthProvider } from '@/root/src/types/auth';
import { APIHandler, APIResponse } from '@/root/src/utils/api';
import { NextResponse } from 'next/server';

export const oauthCallback = async ({
  request,
  context,
}: APICallbackParams<unknown, { provider: string }>) => {
  try {
    const returnTo = request.cookies.get('oauth_return_to')?.value || '/';

    const redirectWithError = (message: string) => {
      console.error('OAuth Failed:', message);
      const url = new URL(returnTo, request.url);
      url.searchParams.set('error', 'OAuth_Failed');
      return NextResponse.redirect(url);
    };

    const resData = request.nextUrl.searchParams;

    if (resData.get('error')) {
      return redirectWithError(
        resData.get('error_description') || 'Unknown error'
      );
    }

    const paramDetails = await context?.params;
    const provider = paramDetails?.provider.toLowerCase() as OAuthProvider;
    const code = request.nextUrl.searchParams.get('code');
    const state = request.nextUrl.searchParams.get('state');

    // Validate code and state
    if (!code || !state) {
      return redirectWithError('Missing code or state');
    }

    // Verify CSRF token
    const storedState = request.cookies.get(`oauth_state_${provider}`)?.value;
    if (storedState !== state) {
      return redirectWithError('Invalid state parameter');
    }

    if (!OAuthProviders[provider]) {
      return redirectWithError('Invalid provider');
    }

    const oauthProvider = OAuthProviders[provider];

    // Step 1: Exchange code for token
    const tokenData = await oauthProvider.exchangeCodeForToken(code);
    // Step 2: Get user info
    const userInfo = await oauthProvider.getUserInfo(tokenData.access_token);

    // Step 4: Generate pseudo-email if real email is missing
    const emailToUse =
      userInfo.email ||
      generatePseudoEmail(provider, userInfo.id, userInfo.name);

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
        },
        include: {
          accounts: true, // ✅ NOW accounts is included!
        },
      });
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

    // Step 5: Generate JWT tokens
    const { accessToken, refreshToken } = generateTokens(
      user.id,
      user.email ?? ''
    );

    // Step 6: Store session
    await prismaUsers.session.create({
      data: {
        userId: user.id,
        token: refreshToken,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        ipAddress: request.headers.get('x-forwarded-for') || '',
        userAgent: request.headers.get('user-agent') || '',
      },
    });

    // Step 7: Redirect to frontend without tokens in url
    const redirectUrl = new URL('/dashboard', request.url);
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
    const returnTo = request.cookies.get('oauth_return_to')?.value || '/';
    const errorUrl = new URL(returnTo, request.url);
    errorUrl.searchParams.set('error', 'OAuth_Failed');
    return NextResponse.redirect(errorUrl);
  }
};

export const GET = APIHandler.authOperations(oauthCallback);
