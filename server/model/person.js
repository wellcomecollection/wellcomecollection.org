// @flow
export type Person = {|
  givenName: string;
  familyName: null;
  name?: string;
  image?: string; // TODO: Make this Picture
  sameAs: Array<any>; //TODO: Make this Array<something>
|}

export function person(data: Person) {
  return (data: Person);
}
