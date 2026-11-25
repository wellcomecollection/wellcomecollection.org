import { PropsWithChildren } from 'react';

import { RequestsList } from '@weco/common/model/requesting';
import { UserInfo } from '@weco/common/model/user';

export const mockUser: UserInfo = {
  userId: '7654321',
  firstName: 'Bruce',
  lastName: 'Wayne',
  email: 'bruciebaby@wayneenterprises.com',
  emailValidated: true,
  barcode: '1234567',
  role: 'Staff',
};

const mockRequestItem = {
  item: {
    id: 'abcdefgh',
    title: 'Test Item',
    locations: [],
    type: 'Item' as const,
  },
  workId: '12345678',
  pickupLocation: {
    id: 'test',
    label: 'Test',
    type: 'LocationDescription' as const,
  },
  status: {
    id: 'test',
    label: 'Test',
    type: 'RequestStatus' as const,
  },
  type: 'Request' as const,
};

export const mockItemRequests: RequestsList = {
  results: [mockRequestItem],
  totalResults: 1,
  type: 'ResultList',
};

/**
 * Creates a mock for @weco/common/contexts/UserContext.
 *
 * Usage:
 *   jest.mock('@weco/common/contexts/UserContext', () => {
 *     const { mockUserContext } = require('@weco/common/test/fixtures/identity/user');
 *     return mockUserContext();
 *   });
 *
 * The returned useUserContext is a jest.fn(), so individual tests
 * can override it with mockReturnValueOnce if needed.
 */
export const mockUserContext = (user: UserInfo = mockUser) => {
  const useUserContext = jest.fn().mockReturnValue({
    user,
    userIsStaffWithRestricted: false,
    state: 'signedin' as const,
    reload: jest.fn(),
  });

  return {
    useUserContext,
    UserContextProvider: ({ children }: PropsWithChildren) => children,
  };
};
