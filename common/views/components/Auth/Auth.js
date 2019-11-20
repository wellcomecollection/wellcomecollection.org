// @flow
import Router from 'next/router';
import fetch from 'isomorphic-unfetch';
import React, { type Node, useEffect, useState } from 'react';
import jwt from 'jsonwebtoken';
import uuidv4 from 'uuid/v4';
import crypto from 'crypto-browserify';
import base64url from 'base64url';

type TokenParams = {|
  grant_type: string,
  client_id: string,
  code?: string,
  code_verifier?: string,
  refresh_token?: string,
  redirect_uri?: string,
|};
type AuthState = 'loggedOut' | 'authorising' | 'loggedIn' | 'expired';
type Props = {|
  render: ?({|
    user: any, // TODO: better Flow
    loginUrl: ?string,
    authState: ?AuthState,
  |}) => Node,
|};

const authDomain = 'https://muckingabout.auth.eu-west-1.amazoncognito.com';
const tokenUrl = `${authDomain}/oauth2/token`;

const authParams = {
  response_type: 'code',
  client_id: '3293ce9fep2cj86ejir7r9k4ic',
  redirect_uri: 'http://localhost:3000',
  scope: ['email', 'openid'].join(' '),
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
    return JSON.parse(getFromLocalStorage('user'));
  } catch (e) {
    return null;
  }
}

const Auth = ({ render }: Props) => {
  const [code, setCode] = useState(null);
  const [authState, setAuthState] = useState(null);
  const [user, setUser] = useState(null);
  const [loginUrl, setLoginUrl] = useState(null);

  function logIn(url: string, tokenParams: TokenParams) {
    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams(tokenParams),
    })
      .then(r => {
        if (r.status === 200) return r.json();

        throw Error('Invalid code');
      })
      .then(tokenJson => {
        const refreshToken = tokenJson.refresh_token;
        const idToken = tokenJson.id_token;

        setUser(jwt.decode(idToken));

        window.localStorage.setItem(
          'user',
          JSON.stringify(jwt.decode(idToken))
        );
        refreshToken &&
          window.localStorage.setItem('refreshToken', refreshToken);

        setAuthState(authStates.loggedIn);
      })
      .catch(error => {
        console.log(error); // TODO: Sentry
        setAuthState(authStates.loggedOut);
      });
  }

  useEffect(() => {
    const newCode = Router.query.code;
    const newUser = getLocalStorageJson('user');

    setUser(newUser);
    setCode(newCode);

    if (newUser) {
      const expires = newUser.exp * 1000; // TODO: this should be based on the access_token, not the id_token

      if (expires <= Date.now()) {
        setAuthState(authStates.expired);
      } else {
        setAuthState(authStates.loggedIn);
      }
    } else if (newCode) {
      setAuthState(authStates.authorising);
    } else {
      setAuthState(authStates.loggedOut);
    }
  }, []);

  useEffect(() => {
    if (authState === authStates.expired) {
      const refreshToken = getFromLocalStorage('refreshToken');
      const tokenParams = {
        grant_type: 'refresh_token',
        client_id: authParams.client_id,
        refresh_token: refreshToken,
      };
      logIn(tokenUrl, tokenParams);
    } else if (authState === authStates.loggedIn) {
      console.info(user);
    } else if (authState === authStates.authorising) {
      const codeVerifier = getFromLocalStorage('codeVerifier');
      const tokenParams = {
        grant_type: 'authorization_code',
        client_id: authParams.client_id,
        redirect_uri: authParams.redirect_uri,
        code_verifier: codeVerifier,
        code: code || '',
      };
      logIn(tokenUrl, tokenParams);
    } else if (authState === authStates.loggedOut) {
      const verifier = base64url(uuidv4());
      window.localStorage.setItem('codeVerifier', verifier);
      const challenge = base64url(
        crypto
          .createHash('sha256')
          .update(verifier)
          .digest()
      );

      setLoginUrl(
        `${authDomain}/oauth2/authorize?${new URLSearchParams({
          ...authParams,
          code_challenge: challenge,
          code_challenge_method: 'S256',
        }).toString()}`
      );
    }
  }, [authState]);

  if (render) {
    return <>{render({ user, loginUrl, authState })}</>;
  }
};

export default Auth;
