import React, { useState, useEffect } from 'react';

import { SolidButton } from '@weco/common/views/components/ButtonSolid/ButtonSolid';
// @ts-ignore
import TextInput from '@weco/common/views/components/TextInput/TextInput';
import SpacingComponent from '@weco/common/views/components/SpacingComponent/SpacingComponent';
// @ts-ignore
import SectionHeader from '@weco/common/views/components/SectionHeader/SectionHeader';

import { ErrorMessage } from '../Shared/ErrorMessage';

// At least 8 characters, one uppercase, one lowercase and number
const passwordPolicy = /(?=.{8,})(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).*/;

export const PasswordForm = () => {
  const [pass, setPass] = useState<string>();
  const [passCheck, setPassCheck] = useState<string>();
  const [valid, setValid] = useState<boolean | undefined | ''>(false);
  const [passwordsMatch, setPasswordsMatch] = useState(true);

  useEffect(() => {
    // check if password passes password policy
    pass && !passwordPolicy.test(pass || '') ? setValid(false) : setValid(true);
  }, [pass]);

  useEffect(() => {
    // check if password matches each other
    pass === passCheck ? setPasswordsMatch(true) : setPasswordsMatch(false);
  }, [passCheck]);

  const updatePassword = () => {
    // Update Password
  };

  return (
    <>
      <SectionHeader title="Change your password using the form below." />
      <form>
        <SpacingComponent />
        <TextInput
          placeholder=""
          required={true}
          aria-label="Type new password"
          label="Type new password"
          value={pass}
          setValue={(value: string) => setPass(value)}
          type="password"
          pattern={passwordPolicy}
        />
        {!valid ? (
          <ErrorMessage>
            The password you have entered does not meet the password policy. Please enter a password with at least 8
            characters, a combination of upper and lowercase letters and at least one number.
          </ErrorMessage>
        ) : (
          <></>
        )}
        <SpacingComponent />
        <TextInput
          required={true}
          aria-label="Retype new password"
          label="Reype new password"
          value={passCheck}
          setValue={(value: string) => setPassCheck(value)}
          type="password"
          pattern={passwordPolicy}
        />
        {!passwordsMatch ? <ErrorMessage>The passwords you entered did not match.</ErrorMessage> : <></>}
        <SpacingComponent />
        <SolidButton disabled={!valid} onClick={updatePassword}>
          Update Password
        </SolidButton>
        <input type="submit" value="Submit" hidden={true} />
      </form>
    </>
  );
};
