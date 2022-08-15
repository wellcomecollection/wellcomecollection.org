import { useState } from 'react';
import axios, { AxiosError } from 'axios';
import { SendVerificationEmailSchema } from '../../types/schemas/send-verification-email';

export enum SendVerificationEmailError { // eslint-disable-line no-shadow
  UNKNOWN,
}

type UseSendVerificationEmailMutation = {
  sendVerificationEmail: (SendVerificationEmailSchema) => void;
  isLoading: boolean;
  isSuccess: boolean;
  error?: SendVerificationEmailError;
};

export function useSendVerificationEmail(): UseSendVerificationEmailMutation {
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<SendVerificationEmailError>();

  const sendVerificationEmail = (
    sendVerificationEmailBody: SendVerificationEmailSchema
  ) => {
    setIsLoading(true);
    axios
      .put(
        '/account/api/users/me/send-verification-email',
        sendVerificationEmailBody
      )
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
