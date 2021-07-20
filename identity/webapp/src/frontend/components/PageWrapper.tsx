import React from 'react';
import HeaderPrototype from '@weco/common/views/components/Header/HeaderPrototype';
import useIsFontsLoaded from '@weco/common/hooks/useIsFontsLoaded';

export const PageWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  useIsFontsLoaded();

  return (
    <>
      <HeaderPrototype siteSection="collections" />
      <div>{children}</div>
    </>
  );
};
