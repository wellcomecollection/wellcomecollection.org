export interface UserListSchema {
  search?: {
    page: number;
    pageSize: number;
    query: string;
  };
  results?: {
    patronId: string;
    barcode: string;
    title: string;
    firstName: string;
    lastName: string;
    email: string;
    emailValidated: boolean;
    locked: boolean;
    creationDate: string;
    lastLogin: string;
    lastLoginIp: string;
    totalLogins: number;
  }[];
  [k: string]: unknown;
}
