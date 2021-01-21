import React, { useState, useEffect } from 'react';

import { SolidButton } from '@weco/common/views/components/ButtonSolid/ButtonSolid';
import { OutlinedButton } from '@weco/common/views/components/ButtonOutlined/ButtonOutlined';

// @ts-ignore
import TextInput from '@weco/common/views/components/TextInput/TextInput';
import SpacingComponent from '@weco/common/views/components/SpacingComponent/SpacingComponent';

import { ErrorMessage } from '../Shared/ErrorMessage';
import { PasswordInput } from '../Shared/PasswordInput';
import { UserInfo } from './AccountManagement';

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

export const ProfileForm: React.FC<UserInfo> = ({ firstName, lastName, emailAddress, libraryCardNumber }) => {
  const [email, setEmail] = useState<string>(emailAddress);
  const [password, setPassword] = useState<string>('');
  const [alreadyExists, setAlreadyExists] = useState<boolean>(false);
  const [valid, setValid] = useState<boolean | undefined | string>(false);
  const [saved, setSaved] = useState<boolean>(true);

  useEffect(() => {
    // TODO: check if email exists
    setAlreadyExists(false);
  }, [email]);

  useEffect(() => {
    // TODO: validate email
    setValid(Boolean(email));
  }, [email]);

  const handleEmailChange = (value: string) => {
    setEmail(value);
    setSaved(false);
  };

  const saveChanges = () => {
    // TODO: Save changes
    setSaved(true);
  };

  const deleteAccount = () => {
    // TODO: Delete Account
  };

  return (
    <div>
      <ExistingData label="Name" value={`${firstName} ${lastName}`} />
      <ExistingData label="Library card number" value={libraryCardNumber} />
      <h2 className="font-wb font-size-3">Change email</h2>
      <form>
        <TextInput
          placeholder=""
          required={true}
          aria-label="Email Address"
          label="Email address"
          value={email}
          type="email"
          setValue={handleEmailChange}
        />
        {alreadyExists && (
          <ErrorMessage>
            This account already exists. You can try to <a href="TBC">login</a>
          </ErrorMessage>
        )}
        <SpacingComponent />
        <PasswordInput value={password} setValue={setPassword} />
        <SpacingComponent />
        <OutlinedButton onClick={deleteAccount}>Delete Account</OutlinedButton>
        <SolidButton disabled={!valid || saved} onClick={saveChanges}>
          Save Changes
        </SolidButton>
        <input type="submit" value="Submit" hidden={true} />
      </form>
    </div>
  );
};
