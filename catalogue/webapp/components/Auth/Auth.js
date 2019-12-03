// @flow
import Router from 'next/router';
import { type Node, useEffect, useState } from 'react';
import fetch from 'isomorphic-unfetch';
import uuidv4 from 'uuid/v4';
import crypto from 'crypto-browserify';
import base64url from 'base64url';

type AuthState = 'loggedOut' | 'authorising' | 'loggedIn' | 'expired';

const authDomain = 'https://id.wellcomecollection.org';
const authParams = {
  response_type: 'code',
  client_id: '5n4vt54rjsg6t691c5b5kiacdv',
  scope: ['openid'].join(' '),
};

function getFromLocalStorage(key: string) {
  return window.localStorage.getItem(key);
}

const authStates = {
  loggedOut: 'loggedOut',
  authorising: 'authorising',
  loggedIn: 'loggedIn',
  expired: 'expired',
};

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

type Props = {|
  render: ({|
    authState: AuthState,
    loginUrl: string,
    token: ?Token,
  |}) => Node,
|};

const Auth = ({ render }: Props) => {
  const [authState, setAuthState] = useState<?AuthState>(null);
  const [token, setToken] = useState<?Token>(null);
  const [loginUrl, setLoginUrl] = useState<?string>(null);
  const [verifier, setVerifier] = useState<?string>(null);

  // Get the inital state
  useEffect(() => {
    const token = getLocalStorageJson('auth.token');
    const code = Router.query.code;

    if (token) {
      setAuthState(authStates.loggedIn);
      const token = getLocalStorageJson('auth.token');
      if (token) {
        setToken(token);
      }
    } else if (code) {
      setAuthState(authStates.authorising);
      const code = Router.query.code;
      if (code) {
        authorise(code);
      }
    } else {
      setAuthState(authStates.loggedOut);

      const { verifier, loginUrl } = createLoginUrlWithVerifier();
      setVerifier(verifier);
      setLoginUrl(loginUrl);
      window.localStorage.setItem('auth.verifier', verifier);
    }
  }, []);

  async function authorise(code: string) {
    const verifier = window.localStorage.getItem('auth.verifier');
    const token = await getToken(code, verifier);

    // Side effects
    window.localStorage.setItem('auth.token', JSON.stringify(token));
    setAuthState(authStates.loggedIn);

    Router.replace({
      pathname: Router.asPath.split('?')[0],
      // TODO: This is very app specific, but it's an absolute pain to try and get this to work
      // The side effect is that it removes the rest of the URL params if there are any
      query: {
        action: Router.query.action,
      },
    });
  }

  return authState ? render({ authState, loginUrl, token }) : null;
};

export default Auth;
