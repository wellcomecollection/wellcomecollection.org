import React, { useState, useEffect } from 'react';

import { SolidButton } from '@weco/common/views/components/ButtonSolid/ButtonSolid';
import { OutlinedButton } from '@weco/common/views/components/ButtonOutlined/ButtonOutlined';

import TextInput from '@weco/common/views/components/TextInput/TextInput';
import SpacingComponent from '@weco/common/views/components/SpacingComponent/SpacingComponent';

import { ErrorMessage } from '../Shared/ErrorMessage';
import { SuccessMessage } from '../Shared/SuccessMessage';
import { PasswordInput } from '../Shared/PasswordInput';
import { UserInfo } from '../hooks/useUserInfo';
import { useUpdateUserInfo } from '../hooks/useUpdateUserInfo';
import { validateEmail } from '../../utility/validate-email-address';

type ExistingDataProps = {
  label: string;
  value: string;
};

const ExistingData = ({ label, value }: ExistingDataProps) => (
  <>
    <p className="font-hnm font-size-5">{label}</p>
    <p className="font-hnl font-size-5">{value}</p>
  </>
);

export type ProfileFormProps = UserInfo & {
  onUpdate: () => void;
};

export const ProfileForm: React.FC<ProfileFormProps> = ({ firstName, lastName, email, barcode, onUpdate }) => {
  const [newEmail, setNewEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [alreadyExists, setAlreadyExists] = useState<boolean>(false);
  const [isValid, setIsValid] = useState<boolean>(false);
  const [isSaved, setIsSaved] = useState<boolean>(true);
  const [isIncorrectPassword, setIsIncorrectPassword] = useState<boolean>(false);
  const [isUpdateSuccessful, setIsUpdateSuccessful] = useState<boolean>(false);
  const [updateUserInfo] = useUpdateUserInfo();

  useEffect(() => {
    setNewEmail(email);
  }, [email]);

  const handleEmailChange = (value: string) => {
    setNewEmail(value);
    setIsValid(validateEmail(value));
    setAlreadyExists(false);
    setIsSaved(value === email);
  };

  const onSaveSuccess = () => {
    setIsIncorrectPassword(false);
    setIsUpdateSuccessful(true);
    setIsSaved(true);
    setPassword('');
    onUpdate();
  };

  const onSaveFailure = (statusCode?: number) => {
    switch (statusCode) {
      case 401: {
        setIsIncorrectPassword(true);
        break;
      }
      case 409: {
        setAlreadyExists(true);
        break;
      }
      default:
        console.error('Error');
    }
  };

  const canSave = isValid && !isSaved;

  const saveChanges = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsUpdateSuccessful(false);
    if (canSave) {
      updateUserInfo({ email, password, newEmail }, onSaveSuccess, onSaveFailure);
    }
  };

  const deleteAccount = () => {
    // TODO: Delete Account
  };

  return (
    <div>
      <ExistingData label="Name" value={`${firstName} ${lastName}`} />
      <ExistingData label="Library card number" value={barcode} />
      <h2 className="font-wb font-size-3">Change email</h2>
      {isUpdateSuccessful && (
        <SuccessMessage>Your email has been updated - please check your inbox to verify this change</SuccessMessage>
      )}
      <form onSubmit={saveChanges}>
        <TextInput
          id="email-address"
          name="newEmail"
          required={true}
          aria-label="Email Address"
          label="Email address"
          value={newEmail}
          type="email"
          setValue={handleEmailChange}
        />
        {alreadyExists && (
          <ErrorMessage>
            This account already exists. You can try to <a href="TBC">login</a>
          </ErrorMessage>
        )}
        <SpacingComponent />
        <PasswordInput value={password} setValue={setPassword} label="password" id="password" />
        {isIncorrectPassword && <ErrorMessage>Incorrect password</ErrorMessage>}
        <SpacingComponent />
        <OutlinedButton onClick={deleteAccount}>Delete Account</OutlinedButton>
        <SolidButton type="submit" disabled={!canSave}>
          Save Changes
        </SolidButton>
      </form>
    </div>
  );
};
