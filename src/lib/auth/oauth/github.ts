//import axios from 'axios';

export interface GitHubTokenResponse {
  access_token: string;
  refresh_token?: string;
  expires_in?: number;
  token_type: string;
  scope: string;
}

export interface GitHubUserInfo {
  id: number;
  login: string;
  email: string;
  phoneNumber?: string;
  name: string;
  avatar_url: string;
}

export class GithubOAuth {
  private clientId = process.env.GITHUB_CLIENT_ID!;
  private clientSecret = process.env.GITHUB_CLIENT_SECRET!;
  private redirectUri = process.env.GITHUB_REDIRECT_URI!;

  getAuthorizationUrl(state: string): string {
    const params = new URLSearchParams({
      client_id: this.clientId,
      redirect_uri: this.redirectUri,
      scope: 'user:email',
      state,
    });

    return `https://github.com/login/oauth/authorize?${params.toString()}`;
  }

  async exchangeCodeForToken(code: string): Promise<GitHubTokenResponse> {
    const response = await fetch(
      'https://github.com/login/oauth/access_token',
      {
        method: 'POST',
        body: new URLSearchParams({
          client_id: this.clientId,
          client_secret: this.clientSecret,
          code,
          redirect_uri: this.redirectUri,
        }).toString(),
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );

    return response.json();
  }

  async getUserInfo(accessToken: string): Promise<GitHubUserInfo> {
    const response = await fetch('https://api.github.com/user', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return response.json();
  }
}
