import React from 'react';
import HeaderPrototype from '@weco/common/views/components/Header/HeaderPrototype';
import { GlobalStyle } from '@weco/common/views/themes/default';
import useIsFontsLoaded from '@weco/common/hooks/useIsFontsLoaded';
import styled from 'styled-components';

const Main = styled.div`
  @media(min-width: ${props => props.theme.sizes.medium}px) {
    background: ${props => props.theme.color('cream')};
  }
`;
export const PageWrapper: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <>
      <GlobalStyle isFontsLoaded={useIsFontsLoaded()} />
      <HeaderPrototype siteSection="collections" />
      <Main>{children}</Main>
    </>
  );
};
