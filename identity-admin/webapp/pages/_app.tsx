import React from 'react';
import { UserProvider } from '@auth0/nextjs-auth0';
import { AppProps } from 'next/app';

function App({ Component, pageProps }: AppProps) {
  return (
    <UserProvider>
      <Component {...pageProps} />
    </UserProvider>
  );
}

export default App;
