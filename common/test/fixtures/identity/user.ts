import { UserInfo } from '../../../model/user';
import { RequestsList } from '../../../model/requesting';

export const mockUser: UserInfo = {
  userId: '7654321',
  firstName: 'Bruce',
  lastName: 'Wayne',
  email: 'bruciebaby@wayneenterprises.com',
  emailValidated: true,
  barcode: '1234567',
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
