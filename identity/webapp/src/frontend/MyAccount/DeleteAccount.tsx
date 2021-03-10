import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { ErrorMessage } from '@hookform/error-message';
import { FieldMargin, Label, InvalidFieldAlert, Button, Cancel } from '../components/Form.style';
import { ModalContainer, ModalTitle } from './MyAccount.style';
import { PasswordInput } from '../components/PasswordInput';
import { ChangeDetailsModalContentProps } from './ChangeDetailsModal';
import { useRequestDelete } from '../hooks/useRequestDelete';
import { Loading } from './Loading';

type DeleteAccountInputs = {
  password: string;
};

export const DeleteAccount: React.FC<ChangeDetailsModalContentProps> = ({ onComplete, onCancel }) => {
  const { requestDelete, isLoading, isSuccess } = useRequestDelete();
  const { control, formState, handleSubmit } = useForm<DeleteAccountInputs>({
    defaultValues: { password: '' },
  });

  useEffect(() => {
    if (isSuccess) {
      onComplete();
    }
  }, [isSuccess, onComplete]);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <ModalContainer>
      <ModalTitle>Delete this account</ModalTitle>
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
