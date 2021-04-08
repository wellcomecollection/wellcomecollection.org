import React from 'react';
import SpacingComponent from '@weco/common/views/components/SpacingComponent/SpacingComponent';
import { OutlinedButton } from '@weco/common/views/components/ButtonOutlined/ButtonOutlined';
import { Auth0StyleErrorBox, ErrorMessage, LogoContainer, PageContainer } from './ErrorPage.style';
import { useLocationQuery } from '../../hooks/use-location-query';

// TODO: Update this to prod.
const logo = 'https://identity-public-assets-stage.s3.eu-west-1.amazonaws.com/images/wellcomecollections-150x50.png';

type ErrorParams = {
  error_description: string | undefined;
};

export const ErrorPage = (): JSX.Element => {
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
