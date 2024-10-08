import { RequestsList } from '@weco/common/model/requesting';
import { Auth0UserProfile, UserInfo } from '@weco/common/model/user';

export const mockUser: UserInfo = {
  userId: '7654321',
  firstName: 'Bruce',
  lastName: 'Wayne',
  email: 'bruciebaby@wayneenterprises.com',
  emailValidated: true,
  barcode: '1234567',
  role: 'Staff',
};

export const mockAuth0Profile: Auth0UserProfile = {
  'https://wellcomecollection.org/patron_barcode': mockUser.barcode,
  'https://wellcomecollection.org/patron_role': mockUser.role,
  email: mockUser.email,
  email_verified: mockUser.emailValidated,
  family_name: mockUser.lastName,
  given_name: mockUser.firstName,
  name: `${mockUser.firstName} ${mockUser.lastName}`,
  nickname: `${mockUser.firstName[0]}.${mockUser.lastName}`.toLowerCase(),
  picture: 'https://test.test/picture.jpg',
  sub: `auth0|p${mockUser.userId}`,
  updated_at: '2021-12-10T12:55:52.958Z',
};

export const mockRequestItem = {
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
