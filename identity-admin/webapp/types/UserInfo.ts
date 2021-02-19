export interface UserInfo {
  firstName: string;
  lastName: string;
  locked: boolean;
  deleteRequested?: string;
  emailValidated: boolean;
  barcode: string;
  patronId: number;
}
