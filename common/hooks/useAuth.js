// @flow
import Router from 'next/router';
import { useEffect, useState } from 'react';
import fetch from 'isomorphic-unfetch';
import uuidv4 from 'uuid/v4';
import crypto from 'crypto-browserify';
import base64url from 'base64url';

const authDomain = 'https://id.wellcomecollection.org';
const authParams = {
  response_type: 'code',
  client_id: '5n4vt54rjsg6t691c5b5kiacdv',
  scope: ['openid'].join(' '),
};

function getFromLocalStorage(key: string) {
  return window.localStorage.getItem(key);
}

function getLocalStorageJson(key: string) {
  try {
    return JSON.parse(getFromLocalStorage(key));
  } catch (e) {
    return null;
  }
}

function getRedirectUrl() {
  return `${window.location.href.split('/')[0]}//${
    window.location.href.split('/')[2]
  }/works/auth-code`;
}

async function getToken(code: string, verifier: string) {
  const url = `${authDomain}/oauth2/token`;
  const params = {
    grant_type: 'authorization_code',
    client_id: authParams.client_id,
    redirect_uri: getRedirectUrl(),
    code_verifier: verifier,
    code: code,
  };
  const token = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams(params),
  }).then(r => {
    if (r.status === 200) return r.json();
    console.error('invalid auth.code');
  });

  return token;
}

function createLoginUrlWithVerifier() {
  const verifier = base64url(uuidv4());
  const challenge = base64url(
    crypto
      .createHash('sha256')
      .update(verifier)
      .digest()
  );

  const loginUrl = `${authDomain}/oauth2/authorize?${new URLSearchParams({
    ...authParams,
    redirect_uri: getRedirectUrl(),
    code_challenge: challenge,
    code_challenge_method: 'S256',
  }).toString()}`;

  return { loginUrl, verifier };
}

type Token = {
  id_token: string,
  access_token: string,
  expired_in: number,
  refresh_token: string,
  token_type: string,
};

const authStates = {
  unauthorized: 'unauthorized',
  authorizing: 'authorizing',
  authorized: 'authorized',
  expired: 'expired',
};

type Uninitialized = {|
  type: 'uninitialized',
|};

type Unauthorized = {|
  type: 'unauthorized',
  loginUrl: string,
|};

type Authorizing = {|
  type: 'authorizing',
|};

type Authorized = {|
  type: 'authorized',
  token: Token,
|};

type Expired = {|
  type: 'expired',
|};

type State = Uninitialized | Unauthorized | Authorizing | Authorized | Expired;

const useAuth = () => {
  const [state, setState] = useState<State>({ type: 'uninitialized' });

  // Get the inital state
  useEffect(() => {
    const token = getLocalStorageJson('auth.token');
    const code = Router.query.code;

    if (token) {
      setState(
        ({
          type: authStates.authorized,
          token: token,
        }: Authorized)
      );
    } else if (code) {
      setState(({ type: authStates.authorizing }: Authorizing));
      const code = Router.query.code;
      if (code) {
        authorise(code);
      }
    } else {
      const { verifier, loginUrl } = createLoginUrlWithVerifier();
      window.localStorage.setItem('auth.verifier', verifier);
      setState(({ type: authStates.unauthorized, loginUrl }: Unauthorized));
    }
  }, []);

  async function authorise(code: string) {
    const verifier = window.localStorage.getItem('auth.verifier');
    const token = await getToken(code, verifier);

    window.localStorage.setItem('auth.token', JSON.stringify(token));
    setState({ type: authStates.authorized, token });
    const link = {
      pathname: Router.asPath.split('?')[0],
      // TODO: This is very app specific, but it's an absolute pain to try and get this to work
      // The side effect is that it removes the rest of the URL params if there are any
      query: {
        action: Router.query.action,
      },
    };
    Router.replace(link, link, { shallow: true });
  }

  return state;
};

export default useAuth;
