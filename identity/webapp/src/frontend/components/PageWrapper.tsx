import React from 'react';
import HeaderPrototype from '@weco/common/views/components/Header/HeaderPrototype';

export const PageWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <>
      <HeaderPrototype siteSection="collections" />
      <div>{children}</div>
    </>
  );
};
