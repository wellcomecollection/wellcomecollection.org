import React, { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { ErrorMessage } from '@hookform/error-message';
import { FieldMargin, Label, InvalidFieldAlert, Button, Cancel } from '../components/Form.style';
import { ModalContainer, ModalTitle, StatusAlert } from './MyAccount.style';
import { PasswordInput } from '../components/PasswordInput';
import { ChangeDetailsModalContentProps } from './ChangeDetailsModal';
import { RequestDeleteError, useRequestDelete } from '../hooks/useRequestDelete';
import { Loading } from './Loading';

type DeleteAccountInputs = {
  password: string;
};

export const DeleteAccount: React.FC<ChangeDetailsModalContentProps> = ({ onComplete, onCancel, isActive }) => {
  const defaultValues: DeleteAccountInputs = useMemo(() => ({ password: '' }), []);
  const { requestDelete, isLoading, isSuccess, error } = useRequestDelete();
  const { control, formState, handleSubmit, setError, reset } = useForm<DeleteAccountInputs>({
    defaultValues,
  });
  const [submissionErrorMessage, setSubmissionErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    reset(defaultValues);
  }, [reset, defaultValues, isActive]);

  useEffect(() => {
    if (isSuccess) {
      onComplete();
    }
  }, [isSuccess, onComplete]);

  useEffect(() => {
    switch (error) {
      case RequestDeleteError.INCORRECT_PASSWORD: {
        setError('password', { type: 'manual', message: 'Incorrect password.' });
        break;
      }
      case RequestDeleteError.BRUTE_FORCE_BLOCKED: {
        setError('password', { type: 'manual', message: 'Your account has been blocked after multiple consecutive login attempts.' });
        break;
      }
      case RequestDeleteError.UNKNOWN: {
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
      <ModalTitle>Delete this account</ModalTitle>
      {submissionErrorMessage && <StatusAlert type="failure">{submissionErrorMessage}</StatusAlert>}
      <p>Are you sure you want to delete your account?</p>
      <p>To permanently delete your account please enter your password and confirm.</p>
      <form onSubmit={handleSubmit(requestDelete)}>
        <FieldMargin>
          <Label htmlFor="delete-account-confirm-password">Password</Label>
          <PasswordInput
            id="delete-account-confirm-password"
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
        <Button isDangerous type="submit">
          Yes, delete my account
        </Button>
        <Cancel onClick={onCancel}>No, take me back to my account</Cancel>
      </form>
    </ModalContainer>
  );
};
