import { GithubOAuth } from '@/lib/auth/oauth/github';

export const OAuthProviders = {
  //google: new GoogleOAuth(),
  github: new GithubOAuth(),
  //linkedin: new LinkedInOAuth(),
};
