import { ErrorMessage } from '@hookform/error-message';
import { FunctionComponent, useEffect, useMemo, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';

import Button, { ButtonTypes } from '@weco/common/views/components/Buttons';
import Space from '@weco/common/views/components/styled/Space';
import { InputErrorMessage } from '@weco/common/views/components/TextInput';
import usePasswordRules from '@weco/identity/hooks/usePasswordRules';
import {
  UpdatePasswordError,
  useUpdatePassword,
} from '@weco/identity/hooks/useUpdatePassword';
import { validPasswordPattern } from '@weco/identity/utils/validation-patterns';
import { ChangeDetailsModalContentProps } from '@weco/identity/views/components/ChangeDetailsModal';
import Loading from '@weco/identity/views/components/Loading';
import { PasswordInput } from '@weco/identity/views/components/PasswordInput';
import PasswordRules from '@weco/identity/views/components/PasswordRules';
import { StatusAlert } from '@weco/identity/views/components/styled/Alert';
import { FieldMargin } from '@weco/identity/views/components/styled/Forms';
import {
  ModalContainer,
  ModalTitle,
} from '@weco/identity/views/components/styled/Modal';

type ChangePasswordInputs = {
  password: string;
  newPassword: string;
  confirmation: string;
};

const ChangePassword: FunctionComponent<ChangeDetailsModalContentProps> = ({
  onComplete,
  isActive,
  setIsModalLoading,
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

  useEffect(() => {
    setIsModalLoading(isLoading);
  }, [isLoading]);

  const newPasswordInput = useWatch({
    control,
    name: 'newPassword',
  }) as string;
  const passwordRules = usePasswordRules(newPasswordInput);

  useEffect(() => {
    reset(defaultValues);
  }, [reset, defaultValues, isActive]);

  useEffect(() => {
    switch (error) {
      case UpdatePasswordError.INCORRECT_PASSWORD: {
        setError('password', {
          type: 'manual',
          message: 'Incorrect password',
        });
        break;
      }
      case UpdatePasswordError.BRUTE_FORCE_BLOCKED: {
        setSubmissionErrorMessage(
          'Your account has been blocked after multiple consecutive login attempts'
        );
        break;
      }
      case UpdatePasswordError.DID_NOT_MEET_POLICY: {
        setError('newPassword', {
          type: 'manual',
          message: 'Password does not meet the policy',
        });
        break;
      }
      case UpdatePasswordError.REPEATED_CHARACTERS: {
        setError('newPassword', {
          type: 'manual',
          message:
            "Repeating characters, such as aaaa, ababab, abcabc, won't be accepted as a password.",
        });
        break;
      }
      case UpdatePasswordError.UNKNOWN: {
        setSubmissionErrorMessage(
          'There is an issue with this library account password. To resolve this, please contact Library Enquiries (library@wellcomecollection.org).'
        );
        break;
      }
    }
  }, [error, setError, formState.submitCount]);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <ModalContainer>
      <ModalTitle>Change password</ModalTitle>
      {submissionErrorMessage && (
        <StatusAlert type="failure">{submissionErrorMessage}</StatusAlert>
      )}

      <form
        onSubmit={handleSubmit(data =>
          updatePassword(
            { password: data.password, newPassword: data.newPassword },
            onComplete
          )
        )}
      >
        <FieldMargin>
          <PasswordInput
            label="Current password"
            id="change-password-current"
            name="password"
            control={control}
            rules={{ required: 'Enter your current password' }}
          />
          <ErrorMessage
            errors={formState.errors}
            name="password"
            render={({ message }) => (
              <InputErrorMessage errorMessage={message} />
            )}
          />
        </FieldMargin>

        <FieldMargin>
          <PasswordInput
            label="Create new password"
            id="change-password-new"
            name="newPassword"
            control={control}
            rules={{
              required: 'Enter your new password',
              pattern: {
                value: validPasswordPattern,
                message: 'Enter a valid password',
              },
            }}
          />
          <ErrorMessage
            errors={formState.errors}
            name="newPassword"
            render={({ message }) => (
              <InputErrorMessage errorMessage={message} />
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
              required: 'Confirm your new password',
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
              <InputErrorMessage errorMessage={message} />
            )}
          />
          <Space $v={{ size: 's', properties: ['margin-top'] }}>
            <PasswordRules {...passwordRules} />
          </Space>
        </FieldMargin>

        <Space $v={{ size: 'l', properties: ['margin-top'] }}>
          <Button
            variant="ButtonSolid"
            type={ButtonTypes.submit}
            text="Update password"
          />
        </Space>
      </form>
    </ModalContainer>
  );
};

export default ChangePassword;
