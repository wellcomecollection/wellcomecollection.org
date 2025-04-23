import { FunctionComponent } from 'react';

import { UseSendVerificationEmail } from '@weco/identity/hooks/useSendVerificationEmail';

export const UnverifiedEmail: FunctionComponent<UseSendVerificationEmail> = ({
  sendVerificationEmail,
  state,
}) => {
  return (
    <>
      {(state === 'loading' || state === 'initial') && (
        <>
          Please verify your email address by clicking the link in the email we
          sent you. <br />
          Didn&rsquo;t get an email?{' '}
        </>
      )}
      {state === 'initial' && (
        <strong>
          <a href="#" onClick={() => sendVerificationEmail()}>
            Send a new verification email
          </a>
        </strong>
      )}
      {state === 'loading' && <strong>Sending a new email...</strong>}
      {state === 'success' && (
        <strong>New email sent! Check your inbox.</strong>
      )}
      {state === 'failed' && (
        <strong>
          Something went wrong. Please try again later. If the error persists,
          please{' '}
          <a href="mailto:library@wellcomecollection.org">
            contact the library team
          </a>
          .
        </strong>
      )}
    </>
  );
};
