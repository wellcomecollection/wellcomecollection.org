import SpacingComponent from '@weco/common/views/components/SpacingComponent/SpacingComponent';
import React from 'react';
import { Container, Wrapper } from '../components/Layout.style';
import { PageWrapper } from '../components/PageWrapper';

export const DeleteRequested: React.FC = () => {
  return (
    <PageWrapper>
      <Container>
        <Wrapper>
          <h1 className="font-wb font-size-1">Delete request received</h1>
          <p className="font-hnr font-size-4">Your request for account deletion has been received.</p>
          <SpacingComponent />
          <p className="font-hnr font-size-4">
            Our Library enquiries team will now progress your request. If there are any issues they will be in touch
            otherwise your account will be removed.
          </p>
          <p className="font-hnr font-size-4">
            <a href="/">Return to homepage</a>
          </p>
        </Wrapper>
      </Container>
    </PageWrapper>
  );
};
