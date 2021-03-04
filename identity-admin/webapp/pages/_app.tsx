import React from 'react';
import { UserProvider } from '@auth0/nextjs-auth0';
import { AppProps } from 'next/app';
import { GlobalStyle } from '../components/GlobalStyle';

function App({ Component, pageProps }: AppProps): JSX.Element {
  return (
    <UserProvider>
      <GlobalStyle />
      <Component {...pageProps} />
    </UserProvider>
  );
}

export default App;
