import React from 'react';
import { useLocation } from 'react-router-dom';
import queryString from 'query-string';
import SpacingComponent from '@weco/common/views/components/SpacingComponent/SpacingComponent';
import { PageWrapper } from '../components/PageWrapper';
import { Container, Title, Wrapper } from '../components/Layout.style';
import { HighlightMessage } from './Registration.style';
import ButtonSolidLink from '@weco/common/views/components/ButtonSolidLink/ButtonSolidLink';

export const AccountValidated = (): JSX.Element => {
  const { search } = useLocation();

  const { success, message } = queryString.parse(search, {
    parseBooleans: true,
  });

  return (
    <PageWrapper>
      <Container>
        <Wrapper>
          {success ? (
            <>
              <Title>Email verified</Title>
              <p>Thank you for verifying your email address.</p>
              <p>
                The library team will review your application and will confirm your membership within the next 72 hours.
                In the meantime, you can browse through <a href="/collections">our digital collections</a> or sign in to
                your account below.
              </p>
              <HighlightMessage>
                <strong>Reminder:</strong> you will need to email a form of personal identification (ID) and proof of
                address to the Library team in order to confirm your details.
              </HighlightMessage>
              <ButtonSolidLink link="/account" text="Continue to Sign in" />
            </>
          ) : (
            <>
              <Title>Failed to verify email</Title>
              <p>{message}</p>
              <div>
                If you need help, please{' '}
                <a
                  href="https://wellcomelibrary.org/using-the-library/services-and-facilities/contact-us/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  contact us
                </a>
              </div>
            </>
          )}
          <SpacingComponent />
        </Wrapper>
      </Container>
    </PageWrapper>
  );
};
