import { ErrorMessage } from '@hookform/error-message';
import { FunctionComponent, useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';

import { useUserContext } from '@weco/common/contexts/UserContext';
import { font } from '@weco/common/utils/classnames';
import Button, { ButtonTypes } from '@weco/common/views/components/Buttons';
import Space from '@weco/common/views/components/styled/Space';
import TextInput, {
  InputErrorMessage,
} from '@weco/common/views/components/TextInput';
import {
  UpdateUserError,
  useUpdateUser,
} from '@weco/identity/hooks/useUpdateUser';
import { validEmailPattern } from '@weco/identity/utils/validation-patterns';
import Loading from '@weco/identity/views/components/Loading';
import { PasswordInput } from '@weco/identity/views/components/PasswordInput';
import { FieldMargin } from '@weco/identity/views/components/styled/forms';

import { ChangeDetailsModalContentProps } from './ChangeDetailsModal';
import { ModalContainer, ModalTitle, StatusAlert } from './MyAccount.styles';

type ChangeEmailInputs = {
  email: string;
  password: string;
};

const ChangeEmail: FunctionComponent<ChangeDetailsModalContentProps> = ({
  onComplete,
  isActive,
  setIsModalLoading,
}) => {
  const [initialEmail, setInitialEmail] = useState<string>('');
  const { user, state: userState } = useUserContext();
  const { updateUser, state: updateState, error } = useUpdateUser();

  const { control, trigger, reset, formState, handleSubmit, setError } =
    useForm<ChangeEmailInputs>({
      defaultValues: { email: initialEmail, password: '' },
    });
  const [submissionErrorMessage, setSubmissionErrorMessage] = useState<
    string | null
  >(null);

  useEffect(() => {
    setIsModalLoading(updateState === 'loading');
  }, [updateState]);

  useEffect(() => {
    reset({ password: '' });
  }, [reset, isActive]);

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
  }, [error, setError, formState.submitCount]);

  if (userState === 'loading' || updateState === 'loading') {
    return <Loading />;
  }

  const onSubmit = (data: ChangeEmailInputs): void => {
    setInitialEmail(data.email);
    updateUser(data, onComplete);
  };

  return (
    <ModalContainer>
      <ModalTitle>Change email</ModalTitle>
      {submissionErrorMessage && (
        <StatusAlert type="failure">{submissionErrorMessage}</StatusAlert>
      )}
      <Space $v={{ size: 'm', properties: ['margin-bottom'] }}>
        <h3 className={font('intb', 5)} style={{ marginBottom: 0 }}>
          Email
        </h3>
        <p className={font('intr', 5)} style={{ marginBottom: 0 }}>
          {user?.email}
        </p>
      </Space>
      <form onSubmit={handleSubmit(onSubmit)}>
        <FieldMargin>
          <Controller
            name="email"
            control={control}
            defaultValue={initialEmail}
            rules={{
              required: 'Enter an email address',
              pattern: {
                value: validEmailPattern,
                message:
                  'Enter an email address in the correct format, like name@example.com',
              },
              validate: {
                hasChanged: newValue => {
                  return (
                    newValue !== user?.email ||
                    'You must enter a new email address to update your library account'
                  );
                },
              },
            }}
            render={({
              field: { onChange, value, name },
              fieldState: { invalid },
            }) => (
              <TextInput
                required
                id={name}
                label="New email address"
                value={value}
                setValue={onChange}
                isValid={!invalid}
                setIsValid={() => trigger('email')}
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
            rules={{ required: 'Enter your password' }}
          />
          <ErrorMessage
            errors={formState.errors}
            name="password"
            render={({ message }) => (
              <InputErrorMessage errorMessage={message} />
            )}
          />
        </FieldMargin>
        <Space $v={{ size: 'l', properties: ['margin-top'] }}>
          <Button
            variant="ButtonSolid"
            type={ButtonTypes.submit}
            text="Update email"
          />
        </Space>
      </form>
    </ModalContainer>
  );
};

export default ChangeEmail;
