// @flow
import {
  type Uninitialized,
  type Unauthorized,
  type Authorizing,
  type Authorized,
  type Expired,
} from '@weco/common/hooks/useAuth';

type AuthStates = {|
  uninitialized: Uninitialized,
  unauthorized: Unauthorized,
  authorizing: Authorizing,
  authorized: Authorized,
  expired: Expired,
|};

const authStates: AuthStates = {
  uninitialized: {
    type: 'uninitialized',
  },
  unauthorized: {
    type: 'unauthorized',
    loginUrl: '/loginUrl',
  },
  authorizing: {
    type: 'authorizing',
  },
  authorized: {
    type: 'authorized',
    token: {
      id_token: 'abc',
      access_token: 'def',
      expired_in: 4000,
      refresh_token: 'fgh',
      token_type: 'ijk',
    },
  },
  expired: {
    type: 'expired',
  },
};

export default authStates;
