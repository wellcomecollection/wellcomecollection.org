import React from 'react';
import SpacingComponent from '@weco/common/views/components/SpacingComponent/SpacingComponent';
// @ts-ignore
import SectionHeader from '@weco/common/views/components/SectionHeader/SectionHeader';
import { OutlinedButton } from '@weco/common/views/components/ButtonOutlined/ButtonOutlined';
import { useLocationQuery } from '../hooks/use-location-query';

import styled from 'styled-components';

// TODO: Update this to prod.
const logo = 'https://identity-public-assets-stage.s3.eu-west-1.amazonaws.com/images/wellcomecollections-150x50.png';

const LogoContainer = styled.div`
  margin: auto;
  padding:  0 0 42px 0;
  width: 200px;
  border-bottom: 0.2px solid grey;
`;

const Auth0StyleErrorBox = styled.div`
  background-color: white;
  padding: 42px;
  margin: auto;
  border-radius: 5px;
  height: 400px;
  width: 300px;
  justify-content: space-between;
  display: flex;
  flex-direction: column;
`;

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #f0ede3;
  padding: auto;
  height: 100%;
`;

const ErrorMessage = styled.p`
  text-align: center;
`;

type ErrorParams = {
  error_description: string | undefined;
};

export const ErrorPage = () => {
  const { error_description } = useLocationQuery<ErrorParams>();
  return (
    <PageContainer>
      <Auth0StyleErrorBox>
        <LogoContainer>
          <img src={logo} alt="Wellcome Collection Logo" />
        </LogoContainer>
        <SpacingComponent />
        <ErrorMessage className="font-hnl font-size-5">{error_description}</ErrorMessage>
        <SpacingComponent />
        <OutlinedButton>
          <a
            href="https://wellcomelibrary.org/using-the-library/services-and-facilities/contact-us/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Visit our help desk
          </a>
        </OutlinedButton>
      </Auth0StyleErrorBox>
    </PageContainer>
  );
};
