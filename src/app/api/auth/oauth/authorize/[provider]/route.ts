import crypto from 'crypto';
import { NextResponse } from 'next/server';
//import { GoogleOAuth } from '@/lib/auth/oauth/google';
//import { LinkedInOAuth } from '@/lib/auth/oauth/linkedin';
import { HTTP_STATUS } from '@/constants/api';
import { OAuthProviders } from '@/constants/auth';
import { APICallbackParams, OAuthProvider } from '@/types/auth';
import { APIHandler, APIResponse } from '@/utils/api';

export const oauthAuthorize = async ({
  request,
  context,
}: APICallbackParams<unknown, { provider: string }>) => {
  const paramDetails = await context?.params;
  const provider = paramDetails?.provider.toLowerCase() as OAuthProvider;

  if (!OAuthProviders[provider]) {
    return APIResponse.send(HTTP_STATUS.BAD_REQUEST).json({
      error: 'Invalid provider',
    });
  }

  // Generate state for CSRF protection
  const state = crypto.randomBytes(32).toString('hex');
  const returnTo = request.headers.get('referer') || '/';

  // Store state in cookie temporarily
  const response = NextResponse.redirect(
    OAuthProviders[provider].getAuthorizationUrl(state)
  );

  response.cookies.set(`oauth_state_${provider}`, state, {
    httpOnly: true,
    maxAge: 10 * 60, // 10 minutes
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
  });

  response.cookies.set('oauth_return_to', returnTo, {
    httpOnly: true,
    maxAge: 10 * 60, // 10 minutes
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
  });

  return response;
};

export const GET = APIHandler.authOperations(oauthAuthorize);
