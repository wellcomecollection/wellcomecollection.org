import { UserInfo } from '../types/UserInfo';

type UserInfoQuery = {
  userInfo: UserInfo;
  isLoading: boolean;
  error?: unknown;
};

export function useUserInfo(): UserInfoQuery {
  const isLoading = false;
  const error = null;

  // TODO: fetch real user data
  const userInfo = {
    firstName: 'Steve',
    lastName: 'Rogers',
    locked: false,
    emailValidated: false,
  };

  return { userInfo, isLoading, error };
}
