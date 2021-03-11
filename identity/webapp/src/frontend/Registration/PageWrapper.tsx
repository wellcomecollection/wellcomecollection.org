import React from 'react';
import styled from 'styled-components';
import { Logo } from './Logo';

const Header = styled.header`
  position: relative;
  top: 0;
  left: 0;
  right: 0;
  background-color: white;
  border-bottom: 1px solid #ddd;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 85px;

  & > img {
    width: unset;
  }
`;

export const PageWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <>
      <Header>
        <Logo />
      </Header>
      <div>{children}</div>
    </>
  );
};
