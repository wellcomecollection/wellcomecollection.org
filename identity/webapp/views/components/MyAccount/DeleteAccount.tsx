import { ErrorMessage } from '@hookform/error-message';
import { FunctionComponent, useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';

import { font } from '@weco/common/utils/classnames';
import Button, { ButtonTypes } from '@weco/common/views/components/Buttons';
import { InputErrorMessage } from '@weco/common/views/components/TextInput';
import { themeValues } from '@weco/common/views/themes/config';
import {
  RequestDeleteError,
  useRequestDelete,
} from '@weco/identity/hooks/useRequestDelete';
import Loading from '@weco/identity/views/components/Loading';
import { PasswordInput } from '@weco/identity/views/components/PasswordInput';
import { FieldMargin } from '@weco/identity/views/components/styled/forms';

import { ChangeDetailsModalContentProps } from './ChangeDetailsModal';
import {
  ButtonAlign,
  ModalContainer,
  ModalTitle,
  StatusAlert,
} from './MyAccount.styles';

type DeleteAccountInputs = {
  password: string;
};

const DeleteAccount: FunctionComponent<ChangeDetailsModalContentProps> = ({
  onComplete,
  onCancel,
  isActive,
  setIsModalLoading,
}) => {
  const defaultValues: DeleteAccountInputs = useMemo(
    () => ({ password: '' }),
    []
  );
  const { requestDelete, isLoading, isSuccess, error } = useRequestDelete();
  const { control, formState, handleSubmit, setError, reset } =
    useForm<DeleteAccountInputs>({
      defaultValues,
    });
  const [submissionErrorMessage, setSubmissionErrorMessage] = useState<
    string | null
  >(null);

  useEffect(() => {
    reset(defaultValues);
  }, [reset, defaultValues, isActive]);

  useEffect(() => {
    if (isSuccess) {
      onComplete();
    }
  }, [isSuccess, onComplete]);

  useEffect(() => {
    setIsModalLoading(isLoading);
  }, [isLoading]);

  useEffect(() => {
    switch (error) {
      case RequestDeleteError.INCORRECT_PASSWORD: {
        setError('password', {
          type: 'manual',
          message: 'Incorrect password',
        });
        break;
      }
      case RequestDeleteError.BRUTE_FORCE_BLOCKED: {
        setSubmissionErrorMessage(
          'Your account has been blocked after multiple consecutive login attempts'
        );
        break;
      }
      case RequestDeleteError.UNKNOWN: {
        setSubmissionErrorMessage('An unknown error occurred');
        break;
      }
    }
  }, [error, setError, formState.submitCount]);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <ModalContainer>
      <ModalTitle>Cancel library membership</ModalTitle>
      {submissionErrorMessage && (
        <StatusAlert type="failure">{submissionErrorMessage}</StatusAlert>
      )}
      <div className={font('intr', 5)}>
        <p>
          Are you sure you want to delete your account? Your account will be
          closed and you won’t be able to request any items.
        </p>
        <p>
          To permanently delete your library account and cancel your membership,
          please enter your password to confirm.
        </p>
        <form onSubmit={handleSubmit(requestDelete)}>
          <FieldMargin>
            <PasswordInput
              label="Password"
              id="delete-account-confirm-password"
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
          <ButtonAlign>
            <Button
              variant="ButtonSolid"
              colors={themeValues.buttonColors.danger}
              type={ButtonTypes.submit}
              text="Yes, delete my account"
            />
            <Button
              variant="ButtonSolidLink"
              colors={themeValues.buttonColors.greenTransparentGreen}
              link="/account"
              clickHandler={onCancel}
              text="No, go back to my account"
            />
          </ButtonAlign>
        </form>
      </div>
    </ModalContainer>
  );
};

export default DeleteAccount;
