import Icon from '@weco/common/views/components/Icon/Icon';
import SpacingComponent from '@weco/common/views/components/SpacingComponent/SpacingComponent';
import React from 'react';
import { PageWrapper } from './PageWrapper';
import { Container, SuccessMessage, Wrapper } from './Registration.style';

export const AccountCreated: React.FC = () => {
  return (
    <PageWrapper>
      <Container>
        <Wrapper>
          <h1 className="font-wb font-size-1" style={{ textAlign: 'center' }}>
            Account Created
          </h1>
          <SuccessMessage>
            <Icon name="check" />
            Success
          </SuccessMessage>
          <SpacingComponent />
          <p className="font-hnl font-size-5">Thank you for completing registration.</p>
          <p className="font-hnl font-size-5">Please now check your email inbox to verify your email address.</p>
          <p className="font-hnl font-size-5">Please do this within 24 hours.</p>
          <h2 className="font-hnm font-size-4">Did you not receive an email?</h2>
          <p className="font-hnl font-size-5">
            If you don’t see an email from us within the next few minutes, a few things could have happened:
          </p>
          <ul>
            <li className="font-hnl font-size-6">The email is in your spam folder.</li>
            <li className="font-hnl font-size-6">The email address you entered had a mistake or typo.</li>
            <li className="font-hnl font-size-6">You accidentally gave us another email address.</li>
            <li className="ffont-hnl font-size-6">We can’t deliver the email to this address.</li>
          </ul>
          <p className="font-hnm font-size-5">
            {/* TODO: Support email to be confirmed */}
            If you need more help you can contact us at:{' '}
            <a href="mailto:supportemail@wellcome">supportemail@wellcome</a>
          </p>
        </Wrapper>
      </Container>
    </PageWrapper>
  );
};
