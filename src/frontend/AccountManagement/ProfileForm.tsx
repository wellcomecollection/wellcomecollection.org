import React, { useState, useEffect } from 'react';

import { SolidButton } from '@weco/common/views/components/ButtonSolid/ButtonSolid';
import { OutlinedButton } from '@weco/common/views/components/ButtonOutlined/ButtonOutlined';

// @ts-ignore
import TextInput from '@weco/common/views/components/TextInput/TextInput';
import SpacingComponent from '@weco/common/views/components/SpacingComponent/SpacingComponent';
// @ts-ignore
import SectionHeader from '@weco/common/views/components/SectionHeader/SectionHeader';

import { ErrorMessage } from '../Shared/ErrorMessage';

export const ProfileForm: React.FC<{
  existingTitle: string;
  existingFirstName: string;
  existingLastName: string;
  existingEmail: string;
}> = ({ existingTitle, existingFirstName, existingLastName, existingEmail }) => {
  const [title, setTitle] = useState<string>(existingTitle);
  const [email, setEmail] = useState<string>(existingEmail);
  const [alreadyExists, setAlreadyExists] = useState<boolean>(false);
  const [valid, setValid] = useState<boolean | undefined | string>(false);
  const [saved, setSaved] = useState<boolean>(false);

  useEffect(() => {
    // check if email exists
    console.log(saved);
    setAlreadyExists(true);
  }, [email]);

  useEffect(() => {
    setValid(title && email);
  }, [title, email]);

  const saveChanges = () => {
    setSaved(true);
    // Save Changes
  };

  const deleteAccount = () => {
    // Delete Account
  };
  return (
    <div>
      <form>
        <SpacingComponent />
        <SectionHeader title="Personal details" />

        <TextInput
          placeholder=""
          required={true}
          aria-label="Title"
          label="Title"
          value={title}
          setValue={(value: string) => setTitle(value)}
        />
        <SpacingComponent />
        {/* Need to style this */}
        <p>
          {existingFirstName} {existingLastName}
        </p>
        <SpacingComponent />

        <TextInput
          placeholder=""
          required={true}
          aria-label="Email Address"
          label="Email address"
          value={email}
          type="email"
          setValue={(value: string) => setEmail(value)}
        />
        {alreadyExists ? (
          <ErrorMessage>
            This account already exists. You can try to <a href="TBC">{''}login</a>
          </ErrorMessage>
        ) : (
          <></>
        )}
        <SpacingComponent />
        <OutlinedButton onClick={deleteAccount}>Delete Account</OutlinedButton>
        <SolidButton disabled={!valid} onClick={saveChanges}>
          Save Changes
        </SolidButton>
        <input type="submit" value="Submit" hidden={true} />
      </form>
    </div>
  );
};
