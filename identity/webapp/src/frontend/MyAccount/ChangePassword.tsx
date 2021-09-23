import React, { useEffect, useMemo, useState } from 'react';
import { ErrorMessage } from '@hookform/error-message';
import { PasswordInput } from '../components/PasswordInput';
import { FieldMargin, Button } from '../components/Form.style';
import { TextInputErrorMessage } from '@weco/common/views/components/TextInput/TextInput';
import { useForm } from 'react-hook-form';
import { ModalContainer, ModalTitle, StatusAlert } from './MyAccount.style';
import { ChangeDetailsModalContentProps } from './ChangeDetailsModal';
import { PasswordRules } from '../components/PasswordInput/PasswordRules';
import {
  UpdatePasswordError,
  useUpdatePassword,
} from '../hooks/useUpdatePassword';
import { Loading } from './Loading';
import { validPasswordPattern } from '../components/ValidationPatterns';
import Space from '@weco/common/views/components/styled/Space';

type ChangePasswordInputs = {
  password: string;
  newPassword: string;
  confirmation: string;
};

export const ChangePassword: React.FC<ChangeDetailsModalContentProps> = ({
  onComplete,
  isActive,
}) => {
  const defaultValues: ChangePasswordInputs = useMemo(
    () => ({
      password: '',
      newPassword: '',
      confirmation: '',
    }),
    []
  );
  const { updatePassword, isLoading, error } = useUpdatePassword();
  const [newPasswordInput, setNewPasswordInput] = useState('');
  const {
    control,
    getValues,
    setError,
    formState,
    handleSubmit,
    trigger,
    reset,
  } = useForm<ChangePasswordInputs>({
    defaultValues,
  });
  const [submissionErrorMessage, setSubmissionErrorMessage] = useState<
    string | null
  >(null);

  const [isAtLeast8Characters, setIsAtLeast8Characters] = useState(false);
  const [hasLowercaseLetters, setHasLowercaseLetters] = useState(false);
  const [hasUppercaseLetters, setHasUppercaseLetters] = useState(false);
  const [hasNumbers, setHasNumbers] = useState(false);
  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    setIsAtLeast8Characters(Boolean(newPasswordInput.match(/.{8}/)));
    setHasLowercaseLetters(Boolean(newPasswordInput.match(/[a-z]/)));
    setHasUppercaseLetters(Boolean(newPasswordInput.match(/[A-Z]/)));
    setHasNumbers(Boolean(newPasswordInput.match(/[0-9]/)));

    if (newPasswordInput.length > 0) {
      setIsDirty(true);
    }
  }, [newPasswordInput, isDirty]);

  useEffect(() => {
    reset(defaultValues);
  }, [reset, defaultValues, isActive]);

  useEffect(() => {
    switch (error) {
      case UpdatePasswordError.INCORRECT_PASSWORD: {
        setError('password', {
          type: 'manual',
          message: 'Incorrect password.',
        });
        break;
      }
      case UpdatePasswordError.BRUTE_FORCE_BLOCKED: {
        setSubmissionErrorMessage(
          'Your account has been blocked after multiple consecutive login attempts.'
        );
        break;
      }
      case UpdatePasswordError.DID_NOT_MEET_POLICY: {
        setError('newPassword', {
          type: 'manual',
          message: 'Password does not meet the policy.',
        });
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
      {submissionErrorMessage && (
        <StatusAlert type="failure">{submissionErrorMessage}</StatusAlert>
      )}
      <form onSubmit={handleSubmit(data => updatePassword(data, onComplete))}>
        <FieldMargin>
          <PasswordInput
            label="Current password"
            id="change-password-current"
            name="password"
            control={control}
            rules={{ required: 'Enter your current password.' }}
          />
          <ErrorMessage
            errors={formState.errors}
            name="password"
            render={({ message }) => (
              <TextInputErrorMessage>{message}</TextInputErrorMessage>
            )}
          />
        </FieldMargin>
        <FieldMargin>
          <PasswordInput
            updateInput={setNewPasswordInput}
            label="Create new password"
            id="change-password-new"
            name="newPassword"
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
            render={({ message }) => (
              <TextInputErrorMessage>{message}</TextInputErrorMessage>
            )}
          />
        </FieldMargin>
        <FieldMargin>
          <PasswordInput
            label="Re-enter new password"
            id="change-password-confirm"
            name="confirmation"
            control={control}
            rules={{
              required: 'Confirm your new password.',
              validate: async value => {
                const isNewPasswordValid = await trigger('newPassword');
                if (isNewPasswordValid) {
                  return (
                    value === getValues('newPassword') ||
                    'Passwords do not match'
                  );
                }
                return true;
              },
            }}
          />
          <ErrorMessage
            errors={formState.errors}
            name="confirmation"
            render={({ message }) => (
              <TextInputErrorMessage>{message}</TextInputErrorMessage>
            )}
          />
          {isDirty && (
            <Space v={{ size: 'm', properties: ['margin-top'] }}>
              <PasswordRules
                isAtLeast8Characters={isAtLeast8Characters}
                hasLowercaseLetters={hasLowercaseLetters}
                hasUppercaseLetters={hasUppercaseLetters}
                hasNumbers={hasNumbers}
              />
            </Space>
          )}
        </FieldMargin>
        <Button type="submit">Update password</Button>
      </form>
    </ModalContainer>
  );
};
