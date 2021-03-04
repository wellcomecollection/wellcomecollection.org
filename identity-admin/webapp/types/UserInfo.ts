export interface UserInfo {
  firstName: string;
  lastName: string;
  locked: boolean;
  deleteRequested?: string;
  email: string;
  emailValidated: boolean;
  barcode: string;
  patronId: number;
  creationDate: string;
  updatedDate: string;
  lastLoginDate: string;
  lastLoginIp: string;
  totalLogins: number;
}

export type EditedUserInfo = Pick<UserInfo, 'firstName' | 'lastName' | 'email'>;
