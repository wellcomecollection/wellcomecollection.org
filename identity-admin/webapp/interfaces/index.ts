// You can include shared interfaces/types in a separate file
// and then use them in any component by importing them. For
// example, to import the interface below do:
//
// import { User } from 'path/to/interfaces';

export type User = {
  userId: number;
  barcode?: string;
  firstName?: string;
  lastName?: string;
  email: string;
  emailValidated: boolean;
  locked: boolean;
  creationDate: string;
  updatedDate: string;
  lastLoginDate?: string;
  lastLoginIp?: string;
  totalLogins: number;
  deleteRequested?: string;
};

export type EditedUser = Pick<User, 'firstName' | 'lastName' | 'email'>;

export type SearchResults = {
  page: number;
  pageSize: number;
  pageCount: number;
  totalResults: number;
  sort: string;
  sortDir: number;
  query: string;
  results: User[];
};

export enum SortField {
  UserId = 'userId',
  Name = 'name',
  Email = 'email',
  LastLogin = 'lastLogin',
}
