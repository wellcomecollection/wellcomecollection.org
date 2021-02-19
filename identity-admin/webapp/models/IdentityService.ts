import axios, { AxiosResponse, AxiosRequestConfig } from 'axios';
import { EditedUserInfo, UserInfo } from '../types/UserInfo';

export class IdentityService {
  private static url(endpoint: string) {
    return process.env.API_BASE_URL + endpoint;
  }

  private static config(accessToken: string): AxiosRequestConfig {
    return {
      headers: {
        'x-api-key': process.env.API_KEY,
        Authorization: 'Bearer ' + accessToken,
      },
      validateStatus: function(status) {
        return status >= 200 && status < 300;
      },
    };
  }

  static async getUserInfo(
    userId: number,
    accessToken: string
  ): Promise<AxiosResponse<UserInfo>> {
    return axios.get(this.url(`/users/${userId}`), this.config(accessToken));
  }

  static async updateUserInfo(
    userId: number,
    accessToken: string,
    newUserInfo: EditedUserInfo
  ): Promise<AxiosResponse<UserInfo>> {
    return axios.put(
      this.url(`/users/${userId}`),
      newUserInfo,
      this.config(accessToken)
    );
  }
}
