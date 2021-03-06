import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { ErrorMessage } from '@hookform/error-message';
import { FieldMargin, Label, TextInput, InvalidFieldAlert, Button } from '../components/Form.style';
import { PasswordInput } from '../components/PasswordInput';
import { validEmailPattern } from '../components/ValidationPatterns';
import { useUserInfo } from './UserInfoContext';
import { Loading } from './Loading';
import { ChangeDetailsModalContentProps } from './ChangeDetailsModal';
import { UpdateUserError, useUpdateUser } from '../hooks/useUpdateUser';
import { ModalContainer, ModalTitle, StatusAlert } from './MyAccount.style';

type ChangeEmailInputs = {
  email: string;
  password: string;
};

export const ChangeEmail: React.FC<ChangeDetailsModalContentProps> = ({ onComplete, isActive }) => {
  const { user, isLoading } = useUserInfo();
  const { updateUser, isLoading: isUpdating, error } = useUpdateUser();
  const { register, control, reset, formState, handleSubmit, setError } = useForm<ChangeEmailInputs>({
    defaultValues: { email: user?.email, password: '' },
  });
  const [submissionErrorMessage, setSubmissionErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    reset({ email: user?.email, password: '' });
  }, [reset, user?.email, isActive]);

  useEffect(() => {
    switch (error) {
      case UpdateUserError.EMAIL_ALREADY_EXISTS: {
        setError('email', { type: 'manual', message: 'Email address already in use.' });
        break;
      }
      case UpdateUserError.INCORRECT_PASSWORD: {
        setError('password', { type: 'manual', message: 'Incorrect password.' });
        break;
      }
      case UpdateUserError.BRUTE_FORCE_BLOCKED: {
        setSubmissionErrorMessage('Your account has been blocked after multiple consecutive login attempts.');
        break;
      }
      case UpdateUserError.UNKNOWN: {
        setSubmissionErrorMessage('An unknown error occurred.');
        break;
      }
    }
  }, [error, setError]);

  if (isLoading || isUpdating) {
    return <Loading />;
  }

  const onSubmit = (data: ChangeEmailInputs): void => updateUser(data, onComplete);

  return (
    <ModalContainer>
      <ModalTitle>Change email</ModalTitle>
      {submissionErrorMessage && <StatusAlert type="failure">{submissionErrorMessage}</StatusAlert>}
      <form onSubmit={handleSubmit(onSubmit)}>
        <FieldMargin>
          <Label htmlFor="email">Email address</Label>
          <TextInput
            id="email"
            name="email"
            ref={register({
              required: 'Enter an email address.',
              pattern: {
                value: validEmailPattern,
                message: 'Enter a valid email address.',
              },
              validate: {
                hasChanged: newValue => {
                  return (
                    newValue !== user?.email || 'You must enter a new email address to update your library account'
                  );
                },
              },
            })}
            invalid={formState.errors.email}
          />
          <ErrorMessage
            errors={formState.errors}
            name="email"
            render={({ message }) => <InvalidFieldAlert aria-label={message}>{message}</InvalidFieldAlert>}
          />
        </FieldMargin>
        <FieldMargin>
          <Label htmlFor="change-email-confirm-password">Confirm password</Label>
          <PasswordInput
            id="change-email-confirm-password"
            name="password"
            control={control}
            rules={{ required: 'Enter your password.' }}
          />
          <ErrorMessage
            errors={formState.errors}
            name="password"
            render={({ message }) => <InvalidFieldAlert>{message}</InvalidFieldAlert>}
          />
        </FieldMargin>
        <Button type="submit">Update email</Button>
      </form>
    </ModalContainer>
  );
};
