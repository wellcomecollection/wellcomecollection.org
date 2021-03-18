import { UserInfo } from './UserInfo.interface';

export type UserInfoState = {
  status: 'loading' | 'success' | 'failure' | 'idle';
  user?: UserInfo;
  error?: string;
};

type UserInfoAction =
  | { type: 'FETCH' }
  | { type: 'RESOLVE'; payload: UserInfo }
  | { type: 'REJECT'; error: string }
  | { type: 'CANCEL' }
  | { type: 'UPDATE'; payload: Partial<UserInfo> };

export function userInfoReducer(state: UserInfoState, action: UserInfoAction): UserInfoState {
  switch (action.type) {
    case 'FETCH': {
      return {
        ...state,
        status: 'loading',
      };
    }
    case 'RESOLVE': {
      return {
        ...state,
        status: 'success',
        user: action.payload,
      };
    }
    case 'REJECT': {
      return {
        ...state,
        status: 'failure',
        error: action.error,
      };
    }
    case 'CANCEL': {
      return {
        ...state,
        status: 'idle',
      };
    }
    case 'UPDATE': {
      return {
        ...state,
        user: {
          ...(state.user as UserInfo),
          ...action.payload,
        },
      };
    }
    default: {
      return state;
    }
  }
}

export const initialState: UserInfoState = {
  status: 'idle',
};
