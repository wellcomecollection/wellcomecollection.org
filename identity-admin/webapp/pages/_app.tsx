import React from 'react';
import { UserProvider } from '@auth0/nextjs-auth0';
import { AppProps } from 'next/app';
import { GlobalStyle } from '../components/GlobalStyle';
import '../css/app.css';
import '../css/UserList.css';
import '../css/Header.css';

function App({ Component, pageProps }: AppProps): JSX.Element {
  return (
    <UserProvider>
      <GlobalStyle />
      <Component {...pageProps} />
    </UserProvider>
  );
}

export default App;
