import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { ErrorMessage } from '@hookform/error-message';
import { FieldMargin, Label, TextInput, InvalidFieldAlert, Button } from '../components/Form.style';
import { PasswordInput } from '../components/PasswordInput';
import { validEmailPattern } from '../components/ValidationPatterns';
import { useUserInfo } from './UserInfoContext';
import { Loading } from './Loading';
import { ChangeDetailsModalContentProps } from './ChangeDetailsModal';
import { UpdateUserError, useUpdateUser } from '../hooks/useUpdateUser';
import { ModalContainer, ModalTitle } from './MyAccount.style';

type ChangeEmailInputs = {
  email: string;
  password: string;
};

export const ChangeEmail: React.FC<ChangeDetailsModalContentProps> = ({ onComplete }) => {
  const { user, isLoading } = useUserInfo();
  const { updateUser, isSuccess, isLoading: isUpdating, error } = useUpdateUser();
  const { register, control, formState, handleSubmit, setError } = useForm<ChangeEmailInputs>({
    defaultValues: { email: user?.email, password: '' },
  });

  useEffect(() => {
    if (isSuccess) {
      onComplete();
    }
  }, [isSuccess, onComplete]);

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
    }
  }, [error, setError]);

  if (isLoading || isUpdating) {
    return <Loading />;
  }

  return (
    <ModalContainer>
      <ModalTitle>Change email</ModalTitle>
      <form onSubmit={handleSubmit(updateUser)}>
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
          <Label htmlFor="password">Confirm password</Label>
          <PasswordInput name="password" control={control} rules={{ required: 'Enter your password.' }} />
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
