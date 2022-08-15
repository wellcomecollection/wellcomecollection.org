import { useState } from 'react';
import axios, { AxiosError } from 'axios';

export enum SendVerificationEmailError { // eslint-disable-line no-shadow
  UNKNOWN,
}

type UseSendVerificationEmailMutation = {
  sendVerificationEmail: () => void;
  isLoading: boolean;
  isSuccess: boolean;
  error?: SendVerificationEmailError;
};

export function useSendVerificationEmail(): UseSendVerificationEmailMutation {
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<SendVerificationEmailError>(null);

  const sendVerificationEmail = () => {
    setIsLoading(true);
    axios
      .post('/account/api/users/me/send-verification-email')
      .then(() => {
        setIsSuccess(true);
      })
      .catch((err: AxiosError) => {
        switch (err.response?.status) {
          default: {
            setError(SendVerificationEmailError.UNKNOWN);
            break;
          }
        }
      })
      .finally(() => setIsLoading(false));
  };

  return { sendVerificationEmail, isLoading, isSuccess, error };
}
