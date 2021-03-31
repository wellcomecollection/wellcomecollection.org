import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import queryString from 'query-string';
import SpacingComponent from '@weco/common/views/components/SpacingComponent/SpacingComponent';
import Info2 from '@weco/common/icons/components/Info2';
import { PageWrapper } from '../components/PageWrapper';
import { Container, Title, Wrapper } from '../components/Layout.style';
import { ErrorAlert, SuccessMessage } from './Registration.style';

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
              <SpacingComponent />
              <SuccessMessage>
                <Info2 />
                {message}
              </SuccessMessage>
              <SpacingComponent />
              <Link to="/">Continue to Sign in</Link>
            </>
          ) : (
            <>
              <Title>Failed to verify email</Title>
              <SpacingComponent />
              <ErrorAlert>
                <Info2 />
                {message}
              </ErrorAlert>
              <SpacingComponent />
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
