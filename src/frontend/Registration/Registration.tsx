import React, { useState, useEffect } from 'react';

import { SolidButton } from '@weco/common/views/components/ButtonSolid/ButtonSolid';
// @ts-ignore
import TextInput from '@weco/common/views/components/TextInput/TextInput';
import SpacingComponent from '@weco/common/views/components/SpacingComponent/SpacingComponent';
import { AccountCreated } from './AccountCreated';
import { RegistrationSummaryParagraph } from './RegistrationSummaryParagraph';
import { ErrorMessage } from '../Shared/ErrorMessage';
import CheckboxRadio from '../WellcomeComponents/CheckBoxLabel';
import axios from 'axios';

// TODO: Update this to prod.
const logo = 'https://identity-public-assets-stage.s3.eu-west-1.amazonaws.com/images/wellcomecollections-150x50.png';
import styled from 'styled-components';
import { PasswordInput } from '../Shared/PasswordInput';

// At least 8 characters, one uppercase, one lowercase and number
const passwordPolicy = /(?=.{8,})(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).*/;
const emailTest = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

const LogoContainer = styled.div`
   {
    margin: auto;
    padding: 42px;
    width: 200px;
  }
`;

export const Registration: React.FC = () => {
  const [firstName, setFirstName] = useState<string>();
  const [lastName, setLastName] = useState<string>();
  const [email, setEmail] = useState<string>();
  const [emailValid, setEmailValid] = useState<boolean>(true);
  const [pass, setPass] = useState<string>();
  const [valid, setValid] = useState<boolean | undefined | ''>(false);
  const [created, setCreated] = useState<boolean>(false);
  const [consent, setConsent] = useState(false);
  const [alreadyExists, setAlreadyExists] = useState(false);
  const [passQualifies, setPassQualifies] = useState(true);
  const [commonPassword, setCommonPassword] = useState(false);
  const [errorOccured, setErrorOccured] = useState(false);

  useEffect(() => {
    // Component did mount set title of the page
    document.title = 'Register for an account';
  }, []);

  useEffect(() => {
    if (email !== '') setEmailValid(emailTest.test(email || ''));
    if (email === '') setEmailValid(true);
  }, [email]);

  useEffect(() => {
    // check if password passes password policy
    pass && !passwordPolicy.test(pass || '') ? setPassQualifies(false) : setPassQualifies(true);
  }, [pass]);

  useEffect(() => {
    setValid(firstName && lastName && email && passwordPolicy.test(pass || ''));
  }, [firstName, lastName, email, pass, consent]);

  const createAccount = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (valid) {
      // Create Account
      try {
        let res = await axios({
          method: 'POST',
          url: '/api/user/create',
          data: {
            firstName,
            lastName,
            email,
            password: pass,
          },
        });
        switch (res.status) {
          case 200:
            setCreated(true);
            break;
          case 201:
            setCreated(true);
            break;
          case 422:
            // If the password has flagged on the common password list by Auth0, or the user has used their own name -> prompted to change the password.
            setCommonPassword(true);
            break;
          case 409:
            // If there is a account already existing with that email address. -> Prompted to login
            setAlreadyExists(true);
            break;
          default:
            setErrorOccured(true);
        }
      } catch (error) {
        console.log('Something went wrong');
      }
    }
  };

  return (
    <div>
      <LogoContainer>
        <img src={logo} alt="Wellcome Collection Logo" />
      </LogoContainer>
      {errorOccured ? (
        <ErrorMessage>
          Something went wrong.
        </ErrorMessage>
      ) : (
        <></>
      )}
      {created ? (
        <AccountCreated />
      ) : (
        <>
          <SpacingComponent />
          <h1 className="font-wb font-size-1" style={{ textAlign: 'center' }}>
            Register
          </h1>
          <RegistrationSummaryParagraph />
          <form onSubmit={createAccount}>
            <SpacingComponent />
            <h1 className="font-wb font-size-4"> Personal Details</h1>
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
            <h1 className="font-wb font-size-4"> Login Details</h1>
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
            {!emailValid ? <ErrorMessage>Please enter a valid email address.</ErrorMessage> : <></>}
            <SpacingComponent />
            <PasswordInput value={pass} setValue={(value: string) => setPass(value)} pattern={passwordPolicy} />
            {commonPassword ? (
              <ErrorMessage>
                The password you have entered has been flagged as a common password, or you have used your name in the
                password. <br />
                Please change your password and try again.
              </ErrorMessage>
            ) : (
              <></>
            )}
            {!passQualifies ? (
              <ErrorMessage>
                The password you have entered does not meet the password policy. Please enter a password with at least 8
                characters, a combination of upper and lowercase letters and at least one number.
              </ErrorMessage>
            ) : (
              <ul>
                <li className="font-hnl font-size-6">One lowercase character</li>
                <li className="font-hnl font-size-6">One uppercase character</li>
                <li className="font-hnl font-size-6">One number</li>
                <li className="font-hnl font-size-6">8 characters minimum</li>
              </ul>
            )}
            <SpacingComponent />
            <CheckboxRadio
              type="checkbox"
              id="T&Cs"
              checked={consent}
              onChange={() => setConsent(!consent)}
              name="Terms and Conditions"
              value={''}
              text={`I have read and agreed to the <a href="https://wellcome.org/about-us/governance/privacy-and-terms" target="_blank" rel="noopener">
                  Privacy and Terms
                </a> for Wellcome Collection.`}
            />
            <SpacingComponent />
            <SolidButton onClick={createAccount}>Create Account</SolidButton>
            <SpacingComponent />
            <input type="submit" value="Submit" hidden={true} />
          </form>
        </>
      )}
    </div>
  );
};
