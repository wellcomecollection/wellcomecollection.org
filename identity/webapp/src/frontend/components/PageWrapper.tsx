import React from 'react';
import Header from '@weco/common/views/components/Header/Header';

export const PageWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <>
      <Header siteSection="collections" />
      <div>{children}</div>
    </>
  );
};
