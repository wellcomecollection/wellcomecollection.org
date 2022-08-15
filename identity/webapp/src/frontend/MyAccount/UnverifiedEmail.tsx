import { FC } from 'react';
import { SendVerificationEmailError } from '../hooks/useSendVerificationEmail';

type Props = {
  sendVerificationEmail: () => void;
  isLoading: boolean;
  isSuccess: boolean;
  error?: SendVerificationEmailError;
};

export const UnverifiedEmail: FC<Props> = ({
  isLoading,
  isSuccess,
  sendVerificationEmail,
  error,
}) => {
  return (
    <>
      Please verify your email address by clicking the link in the email we sent
      you. <br />
      Didn&rsquo;t get an email?{' '}
      {!isLoading && !isSuccess && error === null && (
        <>
          <strong>
            <a href="#" onClick={() => sendVerificationEmail()}>
              Send a new verification email
            </a>
          </strong>
        </>
      )}
      {isLoading && <strong>Sending a new email...</strong>}
      {isSuccess && <strong>New email sent! Check your inbox.</strong>}
      {error !== null && (
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
