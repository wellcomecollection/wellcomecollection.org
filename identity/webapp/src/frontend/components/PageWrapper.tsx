import { FunctionComponent, PropsWithChildren } from 'react';
import Head from 'next/head';
import styled from 'styled-components';
import Header from '@weco/common/views/components/Header/Header';
import { GlobalStyle } from '@weco/common/views/themes/default';
import useIsFontsLoaded from '@weco/common/hooks/useIsFontsLoaded';
import Favicons from '@weco/common/views/components/Favicons/Favicons';

const Main = styled.div`
  ${props =>
    props.theme.media('medium')(`
      background: ${props.theme.color('warmNeutral.300')};
      min-height: calc(100vh - ${props.theme.navHeight}px);
  `)}
`;

type Props = {
  title: string;
};

export const PageWrapper: FunctionComponent<PropsWithChildren<Props>> = ({
  title,
  children,
}) => {
  return (
    <>
      <Head>
        <title>{title} | Wellcome Collection</title>
        <Favicons />
      </Head>
      <GlobalStyle isFontsLoaded={useIsFontsLoaded()} />
      <Header siteSection="collections" />
      <Main>{children}</Main>
    </>
  );
};
