import { FC } from 'react';
import HeaderPrototype from '@weco/common/views/components/Header/HeaderPrototype';
import { GlobalStyle } from '@weco/common/views/themes/default';
import useIsFontsLoaded from '@weco/common/hooks/useIsFontsLoaded';
import styled from 'styled-components';
import Head from 'next/head';
import Favicons from '@weco/common/views/components/Favicons/Favicons';

const Main = styled.div`
  @media (min-width: ${props => props.theme.sizes.medium}px) {
    background: ${props => props.theme.color('cream')};
    min-height: calc(100vh - ${props => props.theme.headerHeight}px)
  }
`;
export const PageWrapper: FC = ({
  children,
}) => {
  return (
    <>
      <Head>
        <Favicons />
      </Head>
      <GlobalStyle isFontsLoaded={useIsFontsLoaded()} />
      <HeaderPrototype siteSection="collections" />
      <Main>{children}</Main>
    </>
  );
};
