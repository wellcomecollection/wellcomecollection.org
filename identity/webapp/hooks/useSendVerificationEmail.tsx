import axios from 'axios';
import { useState } from 'react';

// These are the four states:
//
//    initial:
//        we're just showing the user a message, but they haven't
//        done anything yet.
//    loading:
//        they've clicked the button to send a new verification email,
//        but we still waiting for the identity API to respond
//    success:
//        they've asked for a new verification email, and the API tells us
//        it's been sent
//    failed:
//        they've asked for a new verification email, and something went wrong
//
type State = 'initial' | 'loading' | 'success' | 'failed';

export type UseSendVerificationEmailProps = {
  sendVerificationEmail: () => void;
  state: State;
};

export function useSendVerificationEmail(): UseSendVerificationEmailProps {
  const [state, setState] = useState<State>('initial');

  const sendVerificationEmail = async () => {
    setState('loading');
    try {
      const response = await axios.post(
        '/account/api/users/me/send-verification-email'
      );

      if (response.status !== 204) {
        throw new Error(
          `Unexpected response from /send-verification-email: ${response.status}`
        );
      }

      setState('success');
    } catch (e) {
      console.warn(`Error from /send-verification-email: ${e}`);
      setState('failed');
    }
  };

  return { sendVerificationEmail, state };
}
