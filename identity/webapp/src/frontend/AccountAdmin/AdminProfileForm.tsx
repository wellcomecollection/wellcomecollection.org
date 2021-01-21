import React, { useState, useEffect } from 'react';

import { SolidButton } from '@weco/common/views/components/ButtonSolid/ButtonSolid';
import { OutlinedButton } from '@weco/common/views/components/ButtonOutlined/ButtonOutlined';

// @ts-ignore
import TextInput from '@weco/common/views/components/TextInput/TextInput';
import SpacingComponent from '@weco/common/views/components/SpacingComponent/SpacingComponent';
// @ts-ignore
import SectionHeader from '@weco/common/views/components/SectionHeader/SectionHeader';

export const AdminProfileForm: React.FC<{
  existingTitle: string;
  existingFirstName: string;
  existingLastName: string;
  existingPatronType: string;
  existingGeographicArea: string;
  existingSourceLocation: string;
  existingInterest: string;
  existingUserCategory: string;
  existingEmail: string;
}> = ({
  existingTitle,
  existingFirstName,
  existingLastName,
  existingEmail,
  existingPatronType,
  existingGeographicArea,
  existingSourceLocation,
  existingInterest,
  existingUserCategory,
}) => {
  const [title, setTitle] = useState<string>(existingTitle);
  const [firstName, setFirstName] = useState<string>(existingFirstName);
  const [lastName, setLastName] = useState<string>(existingLastName);
  const [email, setEmail] = useState<string>(existingEmail);
  const [patronType, setPatronType] = useState<string>(existingPatronType);
  const [geographicArea, setGeographicArea] = useState<string>(existingGeographicArea);
  const [sourceLocation, setSourceLocation] = useState<string>(existingSourceLocation);
  const [interest, setInterest] = useState<string>(existingInterest);
  const [userCategory, setUserCategory] = useState<string>(existingUserCategory);
  // const [alreadyExists, setAlreadyExists] = useState<boolean>(false);
  const [valid, setValid] = useState<boolean | undefined | string>(false);
  const [saved, setSaved] = useState<boolean>(false);

  useEffect(() => {
    // check if email exists
    // setAlreadyExists(true);
  }, [email]);

  useEffect(() => {
    setValid(title && email);
  }, [title, email]);

  const saveChanges = () => {
    setSaved(true);
    console.log(saved)
    // Save Changes
  };

  const cancel = () => {
    // Cancel and go back
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
        <TextInput
          placeholder=""
          required={true}
          aria-label="First Name"
          label="First name"
          value={firstName}
          setValue={(value: string) => setFirstName(value)}
        />
        <SpacingComponent />
        <TextInput
          placeholder=""
          required={true}
          aria-label="Last name"
          label="Last name"
          value={lastName}
          setValue={(value: string) => setLastName(value)}
        />
        <SpacingComponent />
        <TextInput
          placeholder=""
          required={true}
          aria-label="Patron Type"
          label="Patron Type"
          value={patronType}
          setValue={(value: string) => setPatronType(value)}
        />
        <SpacingComponent />
        <TextInput
          placeholder=""
          required={true}
          aria-label="Geographic Area"
          label="Geographic Area"
          value={geographicArea}
          setValue={(value: string) => setGeographicArea(value)}
        />
        <SpacingComponent />
        <TextInput
          placeholder=""
          required={true}
          aria-label="Source Location"
          label="Source Location"
          value={sourceLocation}
          setValue={(value: string) => setSourceLocation(value)}
        />
        <SpacingComponent />
        <TextInput
          placeholder=""
          required={true}
          aria-label="Interest"
          label="Interest"
          value={interest}
          setValue={(value: string) => setInterest(value)}
        />
        <SpacingComponent />
        <TextInput
          placeholder=""
          required={true}
          aria-label="User Category"
          label="User Category"
          value={userCategory}
          setValue={(value: string) => setUserCategory(value)}
        />
        <SpacingComponent />
        <SectionHeader title="Login details" />
        <TextInput
          placeholder=""
          required={true}
          aria-label="Email Address"
          label="Email address"
          value={email}
          type="email"
          setValue={(value: string) => setEmail(value)}
        />
        <SpacingComponent />
        <OutlinedButton onClick={cancel}>Cancel</OutlinedButton>
        <SolidButton disabled={!valid} onClick={saveChanges}>
          Update Details
        </SolidButton>
        <input type="submit" value="Submit" hidden={true} />
      </form>
    </div>
  );
};
