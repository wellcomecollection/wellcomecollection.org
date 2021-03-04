import { NextApiRequest, NextApiResponse } from 'next';
import { SearchResults, User } from '../../interfaces';

export default async (
  req: NextApiRequest,
  res: NextApiResponse<SearchResults>
): Promise<void> => {
  const {
    query: { page = '1', status, name, email },
  } = req;

  const p: number = parseInt(page as string);
  res
    .status(200)
    .json(
      dummyResults(
        p,
        typeof status === 'string' ? status : 'active',
        typeof name === 'string' ? name : 'Joe',
        typeof email === 'string' ? email : 'test@example.com'
      )
    );
};

function dummyResults(
  page: number,
  status: string,
  name: string,
  email: string
): SearchResults {
  return {
    page: page,
    pageSize: 3,
    pageCount: 20,
    totalResults: 9,
    sort: 'userId',
    sortDir: 1,
    query: '',
    results: [
      dummyUser(3 * (page - 1) + 1, status, name, email),
      dummyUser(3 * (page - 1) + 2, status, name, email),
      dummyUser(3 * (page - 1) + 3, status, name, email),
    ],
  };
}

function dummyUser(
  userId: number,
  status: string,
  name: string,
  email: string
): User {
  return {
    userId: userId,
    barcode: '' + userId,
    firstName: name,
    lastName: 'Bloggs',
    email: email,
    emailValidated: true,
    locked: status === 'locked',
    creationDate: '18th Feb 2021',
    lastLogin: '18th Feb 2021 00:00',
    lastLoginIp: '127.0.0.1',
    totalLogins: 17,
    deleteRequested: status === 'deletePending' ? status : null,
  };
}
