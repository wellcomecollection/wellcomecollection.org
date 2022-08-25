import { FC } from 'react';
import Head from 'next/head';
import styled from 'styled-components';
import Header from '@weco/common/views/components/Header/Header';
import { GlobalStyle } from '@weco/common/views/themes/default';
import useIsFontsLoaded from '@weco/common/hooks/useIsFontsLoaded';
import Favicons from '@weco/common/views/components/Favicons/Favicons';

const Main = styled.div`
  @media (min-width: ${props => props.theme.sizes.medium}px) {
    background: ${props => props.theme.color('cream')};
    min-height: calc(100vh - ${props => props.theme.navHeight}px);
  }
`;

type Props = {
  title: string;
};

export const PageWrapper: FC<Props> = ({ title, children }) => {
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
