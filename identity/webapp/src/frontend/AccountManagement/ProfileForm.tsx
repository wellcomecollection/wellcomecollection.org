import React, { useState, useEffect } from 'react';

import { SolidButton } from '@weco/common/views/components/ButtonSolid/ButtonSolid';
import { OutlinedButton } from '@weco/common/views/components/ButtonOutlined/ButtonOutlined';

import TextInput from '@weco/common/views/components/TextInput/TextInput';
import SpacingComponent from '@weco/common/views/components/SpacingComponent/SpacingComponent';

import { ErrorMessage } from '../Shared/ErrorMessage';
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

export const ProfileForm: React.FC<UserInfo> = ({ firstName, lastName, email, barcode }) => {
  const [newEmail, setNewEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [alreadyExists, setAlreadyExists] = useState<boolean>(false);
  const [isValid, setIsValid] = useState<boolean>(false);
  const [isSaved, setIsSaved] = useState<boolean>(true);
  const [isIncorrectPassword, setIsIncorrectPassword] = useState<boolean>(false);
  const [updateUserInfo] = useUpdateUserInfo();

  useEffect(() => {
    setNewEmail(email);
  }, [email]);

  const handleEmailChange = (value: string) => {
    setNewEmail(value);
    setIsValid(validateEmail(value));
    setIsSaved(false);
  };

  const onSaveSuccess = () => setIsSaved(true);
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

  const saveChanges = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    updateUserInfo({ email, password, newEmail }, onSaveSuccess, onSaveFailure);
  };

  const deleteAccount = () => {
    // TODO: Delete Account
  };

  const canSave = isValid && !isSaved;

  return (
    <div>
      <ExistingData label="Name" value={`${firstName} ${lastName}`} />
      <ExistingData label="Library card number" value={barcode} />
      <h2 className="font-wb font-size-3">Change email</h2>
      <form>
        <TextInput
          id="email-address"
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
        <SolidButton disabled={!canSave} onClick={saveChanges}>
          Save Changes
        </SolidButton>
        <input type="submit" value="Submit" hidden={true} />
      </form>
    </div>
  );
};
