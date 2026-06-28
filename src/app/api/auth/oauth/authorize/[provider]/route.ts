import crypto from 'crypto';
import { NextRequest, NextResponse } from 'next/server';
//import { GoogleOAuth } from '@/lib/auth/oauth/google';
import { GithubOAuth } from '@/lib/auth/oauth/github';
//import { LinkedInOAuth } from '@/lib/auth/oauth/linkedin';
import { HTTP_STATUS } from '@/constants/api';
import { APIResponse } from '@/root/src/utils/api';

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
    const paramDetails = await params;
    const provider = paramDetails.provider.toLowerCase();

    if (!providers[provider as keyof typeof providers]) {
      return APIResponse.send(HTTP_STATUS.BAD_REQUEST).json({
        error: 'Invalid provider',
      });
    }

    // Generate state for CSRF protection
    const state = crypto.randomBytes(32).toString('hex');
    const returnTo = req.headers.get('referer') || '/';

    // Store state in cookie temporarily
    const response = NextResponse.redirect(
      providers[provider as keyof typeof providers].getAuthorizationUrl(state)
    );

    response.cookies.set(`oauth_state_${provider}`, state, {
      httpOnly: true,
      maxAge: 10 * 60, // 10 minutes
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    });

    response.cookies.set('oauth_return_to', returnTo, {
      httpOnly: true,
      maxAge: 10 * 60, // 10 minutes
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    });

    return response;
  } catch (error) {
    return APIResponse.send(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      error: 'OAuth authorization failed',
    });
  }
}
