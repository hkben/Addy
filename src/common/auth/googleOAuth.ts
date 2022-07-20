import axios from 'axios';
import Browser from 'webextension-polyfill';
import { clientId, clientSecret } from '../../../credentials';

export interface IOAuthToken {
  access_token: string;
  expires_in: string;
}

export interface IOAuthUserInfo {
  id: number;
  email: string;
  picture: string;
  verified_email: boolean;
}

class GoogleOAuth {
  //Google OAuth Credentials
  static client_id = clientId; //export const clientId = 'xxxx' - in credentials.ts
  static client_secret = clientSecret; //export const clientSecret = 'xxxx' - in credentials.ts
  static redirect_url = Browser.identity.getRedirectURL();

  static async authentication(): Promise<string> {
    let auth_params = {
      client_id: this.client_id,
      redirect_uri: this.redirect_url,
      response_type: 'code',
      access_type: 'offline',
      scope: [
        'https://www.googleapis.com/auth/userinfo.email',
        'https://www.googleapis.com/auth/drive.appdata',
      ].join(' '),
    };

    let urlParams = new URLSearchParams(Object.entries(auth_params));
    urlParams.toString();

    let authorizing = await Browser.identity.launchWebAuthFlow({
      url: `https://accounts.google.com/o/oauth2/auth?${urlParams}`,
      interactive: true,
    });

    let searchParams = new URL(authorizing).searchParams;
    let authorizationCode = searchParams.get('code') || '';

    return authorizationCode;
  }

  static async getAccessToken(
    _authorizationCode: string
  ): Promise<IOAuthToken> {
    const response = await axios.post<IOAuthToken>(
      `https://oauth2.googleapis.com/token`,
      {
        code: _authorizationCode,
        grant_type: 'authorization_code',
        client_id: this.client_id,
        client_secret: this.client_secret,
        redirect_uri: this.redirect_url,
      }
    );

    return response.data;
  }

  static async getRefreshAccessToken(
    _refreshToken: string
  ): Promise<IOAuthToken> {
    const response = await axios.post<IOAuthToken>(
      `https://oauth2.googleapis.com/token`,
      {
        refresh_token: _refreshToken,
        grant_type: 'refresh_token',
        client_id: this.client_id,
        client_secret: this.client_secret,
        redirect_uri: this.redirect_url,
      }
    );

    return response.data;
  }

  static async getUserInfo(_accessToken: string) {
    const response = await axios.get<IOAuthUserInfo>(
      `https://www.googleapis.com/oauth2/v1/userinfo`,
      {
        headers: {
          Authorization: `Bearer ${_accessToken}`,
        },
      }
    );

    return response.data.email;
  }

  static async revoke(_refreshToken: string): Promise<boolean> {
    const response = await axios.post(
      `https://oauth2.googleapis.com/revoke?token=${_refreshToken}`
    );

    if (response.status == 200) {
      return true;
    }

    return false;
  }
}

export default GoogleOAuth;
