import React, { useState } from 'react';
import { SolidButton } from '@weco/common/views/components/ButtonSolid/ButtonSolid';
import SpacingComponent from '@weco/common/views/components/SpacingComponent/SpacingComponent';

import { ErrorMessage } from '../Shared/ErrorMessage';
import { PasswordInput } from '../Shared/PasswordInput';
import { useUpdatePassword } from '../hooks/useUpdatePassword';
import { SuccessMessage } from '../Shared/SuccessMessage';

// At least 8 characters, one uppercase, one lowercase and number
const passwordPolicy = /(?=.{8,})(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).*/;

export const PasswordForm: React.FC = () => {
  const [currentPassword, setCurrentPassword] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [confirmation, setConfirmation] = useState<string>('');
  const [isValid, setIsValid] = useState<boolean>(true);
  const [isConfirmed, setIsConfirmed] = useState<boolean>(true);
  const [isUpdateSuccessful, setIsUpdateSuccessful] = useState<boolean>(false);
  const [updatePassword] = useUpdatePassword();

  const resetForm = () => {
    setCurrentPassword('');
    setNewPassword('');
    setConfirmation('');
    setIsValid(true);
    setIsConfirmed(true);
  };

  const handleSubmission = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    updatePassword(
      { currentPassword, newPassword },
      () => {
        setIsUpdateSuccessful(true);
        resetForm();
      },
      () => null
    );
  };

  const handlePasswordChange = (enteredValue: string) => {
    setIsUpdateSuccessful(false);
    setIsValid(passwordPolicy.test(enteredValue));
    setNewPassword(enteredValue);
  };

  const handleConfirmationChange = (enteredValue: string) => {
    setIsUpdateSuccessful(false);
    setIsConfirmed(enteredValue === newPassword);
    setConfirmation(enteredValue);
  };

  const canUpdate = currentPassword && newPassword && confirmation && isValid && isConfirmed;

  return (
    <>
      <h1 className="font-wb font-size-4">Change your password using the form below.</h1>
      <SpacingComponent />
      {isUpdateSuccessful && <SuccessMessage>Your password has been updated</SuccessMessage>}
      <form onSubmit={handleSubmission}>
        <PasswordInput
          label="Current password"
          value={currentPassword}
          setValue={setCurrentPassword}
          id="old-password"
        />
        <SpacingComponent />
        <PasswordInput
          label="New password"
          id="new-password"
          value={newPassword}
          setValue={handlePasswordChange}
          pattern={passwordPolicy.toString()}
        />
        {!isValid && (
          <ErrorMessage>
            The password you have entered does not meet the password policy. Please enter a password with at least 8
            characters, a combination of upper and lowercase letters and at least one number.
          </ErrorMessage>
        )}
        <ul>
          <li className="font-hnl font-size-6">One lowercase character</li>
          <li className="font-hnl font-size-6">One uppercase character</li>
          <li className="font-hnl font-size-6">One number</li>
          <li className="font-hnl font-size-6">8 characters minimum</li>
        </ul>
        <SpacingComponent />
        <PasswordInput
          label="Retype new password"
          value={confirmation}
          setValue={handleConfirmationChange}
          id="confirm-password"
        />
        {!isConfirmed && <ErrorMessage>The passwords you entered did not match.</ErrorMessage>}
        <SpacingComponent />
        <SolidButton type="submit" disabled={!canUpdate}>
          Update Password
        </SolidButton>
      </form>
    </>
  );
};
