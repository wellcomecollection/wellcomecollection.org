import React, { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { ErrorMessage } from '@hookform/error-message';
import { FieldMargin } from '../components/Form.style';
import { TextInputErrorMessage } from '@weco/common/views/components/TextInput/TextInput';
import TextInput from '@weco/common/views/components/TextInput/TextInput';
import { PasswordInput } from '../components/PasswordInput';
import { validEmailPattern } from '../components/ValidationPatterns';
import { useUserInfo } from '@weco/common/views/components/UserInfoContext';
import { Loading } from './Loading';
import { ChangeDetailsModalContentProps } from './ChangeDetailsModal';
import { UpdateUserError, useUpdateUser } from '../hooks/useUpdateUser';
import { ModalContainer, ModalTitle, StatusAlert } from './MyAccount.style';
import ButtonSolid, {
  ButtonTypes,
} from '@weco/common/views/components/ButtonSolid/ButtonSolid';
import Space from '@weco/common/views/components/styled/Space';

type ChangeEmailInputs = {
  email: string;
  password: string;
};

export const ChangeEmail: React.FC<ChangeDetailsModalContentProps> = ({
  onComplete,
  isActive,
}) => {
  const { user, isLoading } = useUserInfo();
  const { updateUser, isLoading: isUpdating, error } = useUpdateUser();
  const { control, trigger, reset, formState, handleSubmit, setError } =
    useForm<ChangeEmailInputs>({
      defaultValues: { email: user?.email, password: '' },
    });
  const [submissionErrorMessage, setSubmissionErrorMessage] = useState<
    string | null
  >(null);

  useEffect(() => {
    reset({ email: user?.email, password: '' });
  }, [reset, user?.email, isActive]);

  useEffect(() => {
    switch (error) {
      case UpdateUserError.EMAIL_ALREADY_EXISTS: {
        setError('email', {
          type: 'manual',
          message: 'Email address already in use',
        });
        break;
      }
      case UpdateUserError.INCORRECT_PASSWORD: {
        setError('password', {
          type: 'manual',
          message: 'Incorrect password',
        });
        break;
      }
      case UpdateUserError.BRUTE_FORCE_BLOCKED: {
        setSubmissionErrorMessage(
          'Your account has been blocked after multiple consecutive login attempts'
        );
        break;
      }
      case UpdateUserError.UNKNOWN: {
        setSubmissionErrorMessage('An unknown error occurred');
        break;
      }
    }
  }, [error, setError]);

  if (isLoading || isUpdating) {
    return <Loading />;
  }

  const onSubmit = (data: ChangeEmailInputs): void =>
    updateUser(data, onComplete);

  return (
    <ModalContainer>
      <ModalTitle>Change email</ModalTitle>
      {submissionErrorMessage && (
        <StatusAlert type="failure">{submissionErrorMessage}</StatusAlert>
      )}
      <form onSubmit={handleSubmit(onSubmit)}>
        <FieldMargin>
          <Controller
            name="email"
            control={control}
            defaultValue=""
            rules={{
              required: 'Enter an email address.',
              pattern: {
                value: validEmailPattern,
                message: 'Enter a valid email address',
              },
            }}
            render={({ onChange, value, name }, { invalid }) => (
              <TextInput
                required
                id={name}
                label="Email address"
                value={value}
                setValue={onChange}
                isValid={!invalid}
                setIsValid={async () => await trigger('email')}
                showValidity={formState.isSubmitted}
                errorMessage={formState.errors.email?.message}
              />
            )}
          />
        </FieldMargin>
        <FieldMargin>
          <PasswordInput
            label="Confirm password"
            id="change-email-confirm-password"
            name="password"
            control={control}
            rules={{ required: 'Enter your password.' }}
          />
          <ErrorMessage
            errors={formState.errors}
            name="password"
            render={({ message }) => (
              <TextInputErrorMessage>{message}</TextInputErrorMessage>
            )}
          />
        </FieldMargin>
        <Space v={{ size: 'l', properties: ['margin-top'] }}>
          <ButtonSolid type={ButtonTypes.submit} text="Update email" />
        </Space>
      </form>
    </ModalContainer>
  );
};
