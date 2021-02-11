import React from 'react';
import { UserProvider } from '@auth0/nextjs-auth0';

// @todo.
const App: React.FC<any> = ({ Component, pageProps }) => {
  return (
    <UserProvider>
      <Component {...pageProps} />
    </UserProvider>
  );
};

export default App;
