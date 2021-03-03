import React from 'react';
import styled from 'styled-components';

// TODO: Update this to prod.
const logo = 'https://identity-public-assets-stage.s3.eu-west-1.amazonaws.com/images/wellcomecollections-150x50.png';

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
  height: 73px;

  @media screen and (min-width: 600px) {
    height: 87px;
  }

  & > img {
    width: unset;
  }
`;

export const PageWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <>
      <Header>
        <img src={logo} alt="Wellcome Collection" />
      </Header>
      <div>{children}</div>
    </>
  );
};
