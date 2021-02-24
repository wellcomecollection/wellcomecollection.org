import React, { ReactNode } from 'react';
import Head from 'next/head';
import styled from 'styled-components';

const Container = styled.div`
  max-width: 75em;
  margin: 0 auto;
`;

type Props = {
  children?: ReactNode;
  title?: string;
};

const Layout = ({
  children,
  title = 'Account administration',
}: Props): JSX.Element => {
  return (
    <div>
      <Head>
        <title>{title}</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <Container>{children}</Container>
    </div>
  );
};

export default Layout;
