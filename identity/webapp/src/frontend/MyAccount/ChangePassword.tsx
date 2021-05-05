import React, { useEffect, useMemo, useState } from 'react';
import { ErrorMessage } from '@hookform/error-message';
import { PasswordInput } from '../components/PasswordInput';
import { FieldMargin, Label, InvalidFieldAlert, Button } from '../components/Form.style';
import { useForm } from 'react-hook-form';
import { ModalContainer, ModalTitle, StatusAlert } from './MyAccount.style';
import { ChangeDetailsModalContentProps } from './ChangeDetailsModal';
import { UpdatePasswordError, useUpdatePassword } from '../hooks/useUpdatePassword';
import { Loading } from './Loading';
import { validPasswordPattern } from '../components/ValidationPatterns';

type ChangePasswordInputs = {
  password: string;
  newPassword: string;
  confirmation: string;
};

export const ChangePassword: React.FC<ChangeDetailsModalContentProps> = ({ onComplete, isActive }) => {
  const defaultValues: ChangePasswordInputs = useMemo(
    () => ({
      password: '',
      newPassword: '',
      confirmation: '',
    }),
    []
  );
  const { updatePassword, isLoading, error } = useUpdatePassword();
  const { control, getValues, setError, formState, handleSubmit, trigger, reset } = useForm<ChangePasswordInputs>({
    defaultValues,
  });
  const [submissionErrorMessage, setSubmissionErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    reset(defaultValues);
  }, [reset, defaultValues, isActive]);

  useEffect(() => {
    switch (error) {
      case UpdatePasswordError.INCORRECT_PASSWORD: {
        setError('password', { type: 'manual', message: 'Incorrect password.' });
        break;
      }
      case UpdatePasswordError.DID_NOT_MEET_POLICY: {
        setError('newPassword', { type: 'manual', message: 'Password does not meet the policy.' });
        break;
      }
      case UpdatePasswordError.UNKNOWN: {
        setSubmissionErrorMessage('An unknown error occurred.');
        break;
      }
    }
  }, [error, setError]);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <ModalContainer>
      <ModalTitle>Change password</ModalTitle>
      {submissionErrorMessage && <StatusAlert type="failure">{submissionErrorMessage}</StatusAlert>}
      <form onSubmit={handleSubmit(data => updatePassword(data, onComplete))}>
        <FieldMargin>
          <Label htmlFor="change-password-current">Current password</Label>
          <PasswordInput
            id="change-password-current"
            name="password"
            control={control}
            rules={{ required: 'Enter your current password.' }}
          />
          <ErrorMessage
            errors={formState.errors}
            name="password"
            render={({ message }) => <InvalidFieldAlert>{message}</InvalidFieldAlert>}
          />
        </FieldMargin>
        <FieldMargin>
          <Label htmlFor="change-password-new">New password</Label>
          <PasswordInput
            id="change-password-new"
            name="newPassword"
            showPolicy
            control={control}
            rules={{
              required: 'Enter your new password.',
              pattern: {
                value: validPasswordPattern,
                message: 'Enter a valid password.',
              },
            }}
          />
          <ErrorMessage
            errors={formState.errors}
            name="newPassword"
            render={({ message }) => <InvalidFieldAlert>{message}</InvalidFieldAlert>}
          />
        </FieldMargin>
        <FieldMargin>
          <Label htmlFor="change-password-confirm">Retype new password</Label>
          <PasswordInput
            id="change-password-confirm"
            name="confirmation"
            control={control}
            rules={{
              required: 'Confirm your new password.',
              validate: async value => {
                const isNewPasswordValid = await trigger('newPassword');
                if (isNewPasswordValid) {
                  return value === getValues('newPassword') || 'Passwords do not match';
                }
                return true;
              },
            }}
          />
          <ErrorMessage
            errors={formState.errors}
            name="confirmation"
            render={({ message }) => <InvalidFieldAlert>{message}</InvalidFieldAlert>}
          />
        </FieldMargin>
        <Button type="submit">Update password</Button>
      </form>
    </ModalContainer>
  );
};
