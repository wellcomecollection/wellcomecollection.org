import React, { useState, useEffect } from 'react';

import { SolidButton } from '@weco/common/views/components/ButtonSolid/ButtonSolid';
import { OutlinedButton } from '@weco/common/views/components/ButtonOutlined/ButtonOutlined';
// @ts-ignore
import TextInput from '@weco/common/views/components/TextInput/TextInput';
import SpacingComponent from '@weco/common/views/components/SpacingComponent/SpacingComponent';
// @ts-ignore
import SectionHeader from '@weco/common/views/components/SectionHeader/SectionHeader';

import { AdminAccountCreated } from './AdminAccountCreated';

import { ErrorMessage } from '../Shared/ErrorMessage';

// TODO: Update this to prod.
const logo = 'https://identity-public-assets-stage.s3.eu-west-1.amazonaws.com/images/wellcomecollections-150x50.png';
import styled from 'styled-components';

const LogoContainer = styled.div`
   {
    display: flex;
    width: 200px;
  }
`;

export const AdminRegistration = () => {
  const [title, setTitle] = useState<string>();
  const [firstName, setFirstName] = useState<string>();
  const [lastName, setLastName] = useState<string>();
  const [patronType, setPatronType] = useState<string>();

  // The following four will be dropdowns with predefined set of values.
  // Will need to update these to dropdowns at some point once we know what these values are.
  const [geographicArea, setGeographicArea] = useState<string>();
  const [sourceLocation, setSourceLocation] = useState<string>();
  const [interest, setInterest] = useState<string>();
  const [userCategory, setUserCategory] = useState<string>();

  const [email, setEmail] = useState<string>();
  const [valid, setValid] = useState<boolean | undefined | string>(false);
  const [created, setCreated] = useState<boolean>(false);
  const [alreadyExists, setAlreadyExists] = useState(false);

  useEffect(() => {
    // check if email exists
    setAlreadyExists(true);
  }, [email]);

  useEffect(() => {
    // Do we want error messages for each of these values. Are they all required?
    setValid(title && firstName && lastName && email && geographicArea && sourceLocation && interest && userCategory);
  }, [title && firstName && lastName && email && geographicArea && sourceLocation && interest && userCategory]);

  const createAccount = () => {
    if (valid) {
      // Create account, confirm correct then do the following
      setCreated(true);
      setTitle('');
      setFirstName('');
      setLastName('');
      setPatronType('');
      setGeographicArea('');
      setSourceLocation('');
      setInterest('');
      setUserCategory('');
      setEmail('');
    }
  };

  return (
    <div>
      <LogoContainer>
        <img src={logo} alt="Wellcome Collection Logo" height="200px" />
      </LogoContainer>
      {created ? (
        <AdminAccountCreated createAnother={() => setCreated(false)} />
      ) : (
        <>
          <SpacingComponent />
          <h1 className="font-wb font-size-1">Account Administration</h1>
          <form>
            <SpacingComponent />
            <SectionHeader title="Add new Account" />
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
            {alreadyExists ? <ErrorMessage>This account already exists.</ErrorMessage> : <></>}
            <SpacingComponent />
            <OutlinedButton onClick={() => console.log('cancelled')}>Cancel</OutlinedButton>
            <SolidButton onClick={createAccount}>Create Account</SolidButton>
            <input type="submit" value="Submit" hidden={true} />
          </form>
        </>
      )}
    </div>
  );
};
