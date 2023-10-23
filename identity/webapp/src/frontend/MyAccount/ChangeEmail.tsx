import React, { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { ErrorMessage } from '@hookform/error-message';
import { FieldMargin } from '../components/Form.style';
import TextInput, {
  TextInputErrorMessage,
} from '@weco/common/views/components/TextInput/TextInput';
import { PasswordInput } from '../components/PasswordInput';
import { validEmailPattern } from '../components/ValidationPatterns';
import { Loading } from './Loading';
import { ChangeDetailsModalContentProps } from './ChangeDetailsModal';
import { UpdateUserError, useUpdateUser } from '../hooks/useUpdateUser';
import { ModalContainer, ModalTitle, StatusAlert } from './MyAccount.style';
import ButtonSolid, {
  ButtonTypes,
} from '@weco/common/views/components/ButtonSolid/ButtonSolid';
import Space from '@weco/common/views/components/styled/Space';
import { useUser } from '@weco/common/views/components/UserProvider/UserProvider';
import { font } from '@weco/common/utils/classnames';

type ChangeEmailInputs = {
  email: string;
  password: string;
};

export const ChangeEmail: React.FunctionComponent<
  ChangeDetailsModalContentProps
> = ({ onComplete, isActive, setIsModalLoading }) => {
  const [initialEmail, setInitialEmail] = useState<string>('');
  const { user, state: userState } = useUser();
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
      <Space v={{ size: 'm', properties: ['margin-bottom'] }}>
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
