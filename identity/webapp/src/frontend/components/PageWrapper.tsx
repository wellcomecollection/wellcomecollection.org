import React from 'react';
import HeaderPrototype from '@weco/common/views/components/Header/HeaderPrototype';
import { GlobalStyle } from '@weco/common/views/themes/default';
import useIsFontsLoaded from '@weco/common/hooks/useIsFontsLoaded';

export const PageWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <>
      <GlobalStyle isFontsLoaded={useIsFontsLoaded()} />
      <HeaderPrototype siteSection="collections" />
      <div>{children}</div>
    </>
  );
};
