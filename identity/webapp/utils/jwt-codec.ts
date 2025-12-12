import { JwtPayload, sign, verify } from 'jsonwebtoken';
import getConfig from 'next/config';

const config = getConfig().serverRuntimeConfig;

// we need some jwt encoding to deal with passing data to an auth0 action
// https://auth0.com/docs/customize/actions/flows-and-triggers/login-flow/redirect-with-actions#pass-data-back-to-auth0

export type RegistrationInputs = {
  firstName: string;
  lastName: string;
  termsAndConditions: boolean;
};

// we first need to decode the session token we receive on redirecting from the post-login flow action
// this token will come from request query when this handler is used in the context of the registration form i.e. req.query.session_token
export const decodeToken = (
  token?: string,
  secret?: string
): JwtPayload | string => {
  try {
    if (!token || !secret) {
      throw new Error('no token or secret detected');
    }
    const decoded = verify(token, secret);
    return decoded;
  } catch {
    throw new Error('Invalid session_token in decode');
  }
};

// we then need to add our registration form data to the token along with other details
// this token object includes iat, iss, sub, exp and ip (from auth0 incoming token)
// we must also include the state, which validates our ability to finish the action with /continue
// finally we must make sure to add aud (audience) as without this the token won't be accepted by auth0
type JwtRequiredFields = [
  'iat',
  'iss',
  'sub',
  'exp',
  'aud',
  'state',
  'https://wellcomecollection.org/terms_agreed',
  'https://wellcomecollection.org/first_name',
  'https://wellcomecollection.org/last_name',
];
export type RegistrationJwtPayload = Pick<
  JwtPayload,
  JwtRequiredFields[number]
>;

export const generateNewToken = (
  dataFromAuth0: JwtPayload,
  state: string,
  formData: RegistrationInputs
): string => {
  const payload: RegistrationJwtPayload = {
    ...dataFromAuth0,
    aud: 'https://wellcomecollection.org/account/registration',
    state,
    'https://wellcomecollection.org/terms_agreed': formData.termsAndConditions,
    'https://wellcomecollection.org/first_name': formData.firstName,
    'https://wellcomecollection.org/last_name': formData.lastName,
  };

  const token = sign(payload, config.auth0.actionSecret, {
    algorithm: 'HS256',
  });

  return token;
};
