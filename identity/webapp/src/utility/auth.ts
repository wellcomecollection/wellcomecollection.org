// This is a utility for getting axios instances with an OAuth access
// token in the default headers.
//
// It's based on a file that does the same thing in the identity repo:
// https://github.com/wellcomecollection/identity/blob/5ceab09040b253fb79d7b5399ef31bda9571ad0c/packages/shared/identity-common/src/auth.ts

import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';

type Token = {
  accessToken: string;
  expiresAt: number; // epoch seconds
};

// This is the leeway between when the token actually expires, and the time
// before that after which we'll request a new token
const tokenExpiryThreshold = 30;

export const authenticatedInstanceFactory = (
  getToken: () => Promise<Token>,
  getInstanceConfig: () => AxiosRequestConfig = () => ({})
): (() => Promise<AxiosInstance>) => {
  let instance: AxiosInstance | undefined;
  let accessToken: string | undefined;
  let expiresAt = 0;

  return async (): Promise<AxiosInstance> => {
    const expiryCutoff = Math.ceil(Date.now() / 1000) + tokenExpiryThreshold;
    const needsRefresh = Boolean(!accessToken || expiresAt <= expiryCutoff);
    if (needsRefresh || !instance) {
      try {
        ({ accessToken, expiresAt } = await getToken());
      } catch (e) {
        console.error('Error fetching token', e);
        throw e;
      }

      // Note: divergence from identity, because we need two headers here
      // TODO: Comment properly
      const instanceConfig = getInstanceConfig();

      instance = axios.create({
        ...instanceConfig,
        headers: {
          Authorization: `Bearer ${accessToken}`,
          ...instanceConfig.headers,
        },
      });
    }
    return instance;
  };
};
