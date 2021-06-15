import React from 'react';
import SpacingComponent from '@weco/common/views/components/SpacingComponent/SpacingComponent';
import Info2 from '@weco/common/icons/components/Info2';
import { PageWrapper } from '../components/PageWrapper';
import { SuccessMessage } from './Registration.style';
import { Container, Wrapper } from '../components/Layout.style';

export const AccountCreated: React.FC = () => {
  return (
    <PageWrapper>
      <Container>
        <Wrapper>
          <h1 className="font-wb font-size-1">Activate your library account</h1>
          <SuccessMessage>
            <Info2 />
            Your library account has been created. Before you can sign in, you&apos;ll need to verify your email
            address.
          </SuccessMessage>
          <SpacingComponent />
          <p className="font-hnr">
            We&apos;ve sent you an email with a link to verify your email address and activate your library account.
            Please do this within the next 24 hours, before the link expires.
          </p>
          <p className="font-hnr">You won&apos;t be able to sign in until you have activated your account.</p>
          <h2 className="font-hnr" style={{ fontWeight: 'bold' }}>
            Didn&apos;t receive an email?
          </h2>
          <p className="font-hnr">
            If you don&apos;t see an email from us within the next few minutes, please check the following:
          </p>
          <ul>
            <li className="font-hnr">Is the email is in your spam/junk folder?</li>
            <li className="font-hnr">Was the email address you entered correct?</li>
          </ul>
          <p className="font-hnr" style={{ fontWeight: 'bold' }}>
            If you still haven&apos;t received a verification email or need any other help with your account, please
            contact <a href="mailto:library@wellcomecollection.org">Library enquiries</a>.
          </p>
        </Wrapper>
      </Container>
    </PageWrapper>
  );
};
