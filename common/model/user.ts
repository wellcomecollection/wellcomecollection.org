export type UserInfo = {
  firstName: string;
  lastName: string;
  email: string;
  emailValidated: boolean;
  barcode: string;
  userId: string;
};

// This is the type returned by the Auth0 profile endpoint
export type Auth0UserProfile = {
  sub: string;
  email: string;
  email_verified?: boolean;
  updated_at: string;
  picture?: string;
  name: string;
  given_name: string;
  family_name: string;
  nickname: string;
  'https://wellcomecollection.org/patron_barcode': string;
};

// Auth0 subject claims (aka user IDs) are prefixed with `auth0|`, plus
// the `p` prefix for Sierra patrons.
const SierraUserIdPrefix = 'auth0|p';
const auth0IdToPublic = (subjectClaim: string): string => {
  if (subjectClaim?.startsWith(SierraUserIdPrefix)) {
    return subjectClaim.slice(SierraUserIdPrefix.length);
  } else {
    return subjectClaim;
  }
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const isFullAuth0Profile = (data: any): data is Auth0UserProfile =>
  data &&
  data.given_name &&
  data.family_name &&
  data.email &&
  data.sub &&
  data['https://wellcomecollection.org/patron_barcode'];

export const auth0UserProfileToUserInfo = (
  auth0Profile?: Auth0UserProfile
): UserInfo | undefined =>
  auth0Profile && {
    firstName: auth0Profile.given_name,
    lastName: auth0Profile.family_name,
    email: auth0Profile.email,
    emailValidated: !!auth0Profile.email_verified,
    barcode: auth0Profile['https://wellcomecollection.org/patron_barcode'],
    userId: auth0IdToPublic(auth0Profile.sub),
  };
