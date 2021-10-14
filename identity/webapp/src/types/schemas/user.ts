export interface UserSchema {
  patronId: number;
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
}
