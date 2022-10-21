import React, { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { font } from '@weco/common/utils/classnames';
import { ErrorMessage } from '@hookform/error-message';
import { FieldMargin } from '../components/Form.style';
import { TextInputErrorMessage } from '@weco/common/views/components/TextInput/TextInput';
import ButtonSolid, {
  ButtonTypes,
} from '@weco/common/views/components/ButtonSolid/ButtonSolid';
import ButtonSolidLink from '@weco/common/views/components/ButtonSolidLink/ButtonSolidLink';
import {
  ModalContainer,
  ModalTitle,
  StatusAlert,
  ButtonAlign,
} from './MyAccount.style';
import { PasswordInput } from '../components/PasswordInput';
import { ChangeDetailsModalContentProps } from './ChangeDetailsModal';
import {
  RequestDeleteError,
  useRequestDelete,
} from '../hooks/useRequestDelete';
import { Loading } from './Loading';
import { themeValues } from '@weco/common/views/themes/config';

type DeleteAccountInputs = {
  password: string;
};

export const DeleteAccount: React.FunctionComponent<ChangeDetailsModalContentProps> =
  ({ onComplete, onCancel, isActive, setIsModalLoading }) => {
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
            To permanently delete your library account and cancel your
            membership, please enter your password to confirm.
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
                  <TextInputErrorMessage>{message}</TextInputErrorMessage>
                )}
              />
            </FieldMargin>
            <ButtonAlign>
              <ButtonSolid
                colors={themeValues.buttonColors.danger}
                type={ButtonTypes.submit}
                text="Yes, delete my account"
              />
              <ButtonSolidLink
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
