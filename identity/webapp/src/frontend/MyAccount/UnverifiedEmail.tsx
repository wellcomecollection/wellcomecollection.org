import { FC } from 'react';
import { SendVerificationEmailError } from '../hooks/useSendVerificationEmail';

type Props = {
  sendVerificationEmail: () => void;
  isLoading: boolean;
  isSuccess: boolean;
  error?: SendVerificationEmailError;
};

type State = 'waiting' | 'loading' | 'success' | 'failure';

export const UnverifiedEmail: FC<Props> = ({
  isLoading,
  isSuccess,
  sendVerificationEmail,
  error,
}) => {
  // There are four states we can be in:
  //
  //    1.  The waiting state -- we're just showing the user a message,
  //        but they haven't done anything yet.
  //    2.  The loading state -- they've clicked the button to send a new
  //        verification email, but we don't know if it's succeeded.
  //    3.  The success state -- they've asked for a new verification email,
  //        and the API has succeeded.
  //    4.  The failure state -- they've asked for a new verification email,
  //        and the API has failed.
  //
  const state: State =
    error !== null
      ? 'failure'
      : isLoading
      ? 'loading'
      : isSuccess
      ? 'success'
      : 'waiting';

  return (
    <>
      {(state === 'loading' || state === 'waiting') && (
        <>
          Please verify your email address by clicking the link in the email we
          sent you. <br />
          Didn&rsquo;t get an email?{' '}
        </>
      )}
      {state === 'waiting' && (
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
      {state === 'failure' && (
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
