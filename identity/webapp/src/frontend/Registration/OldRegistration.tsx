import React, { useState, useEffect } from 'react';
import { SolidButton } from '@weco/common/views/components/ButtonSolid/ButtonSolid';
import TextInput from '../WellcomeComponents/TextInput';
import SpacingComponent from '@weco/common/views/components/SpacingComponent/SpacingComponent';
import { AccountCreated } from './AccountCreated';
import { RegistrationSummaryParagraph } from './RegistrationSummaryParagraph';
import { ErrorMessage } from '../Shared/ErrorMessage';
import CheckboxRadio from '../WellcomeComponents/CheckBoxLabel';
import { PasswordInput } from '../Shared/PasswordInput';
import { LogoContainer } from '../Shared/LogoContainer';
import { PageWrapper } from '../Shared/PageWrapper';
import { callMiddlewareApi } from '../../utility/middleware-api-client';

// TODO: Update this to prod.
const logo = 'https://identity-public-assets-stage.s3.eu-west-1.amazonaws.com/images/wellcomecollections-150x50.png';

// At least 8 characters, one uppercase, one lowercase and number
const passwordPolicy = /(?=.{8,})(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).*/;
const emailTest = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

export const OldRegistration: React.FC = () => {
  const [firstName, setFirstName] = useState<string>();
  const [lastName, setLastName] = useState<string>();
  const [email, setEmail] = useState<string>();
  const [emailValid, setEmailValid] = useState<boolean>(true);
  const [pass, setPass] = useState<string>();
  const [valid, setValid] = useState<boolean>(false);
  const [created, setCreated] = useState<boolean>(false);
  const [consent, setConsent] = useState(false);
  const [alreadyExists, setAlreadyExists] = useState(false);
  const [passQualifies, setPassQualifies] = useState(false);
  const [commonPassword, setCommonPassword] = useState(false);
  const [errorOccured, setErrorOccured] = useState(false);

  useEffect(() => {
    // Component did mount set title of the page
    document.title = 'Register for an account';
  }, []);

  useEffect(() => {
    if (email !== '') {
      setEmailValid(emailTest.test(email || ''));
      setAlreadyExists(false);
    }
    if (!email || email === '') {
      setEmailValid(true);
      setAlreadyExists(false);
    }
  }, [email]);

  useEffect(() => {
    setPassQualifies(!pass || passwordPolicy.test(pass || ''));
    setCommonPassword(false);
  }, [pass]);

  useEffect(() => {
    setValid(!!(firstName && lastName && email && passwordPolicy.test(pass || '')));
  }, [firstName, lastName, email, pass, consent]);

  const isFirstNameValid = Boolean(firstName && firstName !== '');
  const isLastNameValid = Boolean(lastName && lastName !== '');

  const createAccount = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (valid) {
      // Create Account
      try {
        await callMiddlewareApi('POST', '/api/user/create', {
          firstName,
          lastName,
          email,
          password: pass,
        })
          .then(() => {
            setCreated(true);
          })
          .catch(error => {
            switch (error.response.status) {
              case 400:
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
          });
      } catch (error) {
        console.log('Something went wrong');
      }
    }
  };

  const emailErrorMessage = () => {
    if (alreadyExists) {
      return (
        <>
          This account already exists. You can try to <a href="/">login</a>.
        </>
      );
    } else if (!emailValid) {
      return 'Please enter a valid email address';
    } else {
      return '';
    }
  };

  const passwordErrorMessage = () => {
    if (commonPassword) {
      return (
        <>
          The password you have entered has been flagged as a common password, or you have used your name in the
          password.
          <br />
          Please change your password and try again.
        </>
      );
    } else if (!passQualifies) {
      return 'The password you have entered does not meet the password policy. Please enter a password with at least 8 characters, a combination of upper and lowercase letters and at least one number.';
    } else {
      return '';
    }
  };

  return (
    <PageWrapper>
      <LogoContainer>
        <img src={logo} alt="Wellcome Collection Logo" />
      </LogoContainer>
      {errorOccured && <ErrorMessage>Something went wrong.</ErrorMessage>}
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
            <h1 className="font-wb font-size-4"> Personal details</h1>
            <TextInput
              id="firstname"
              placeholder=""
              required={true}
              aria-label="First Name"
              label="First name"
              value={firstName}
              setValue={(value: string) => setFirstName(value)}
              isValid={isFirstNameValid}
              showValidity={isFirstNameValid}
              errorMessage={'Please enter your first name'}
            />
            <SpacingComponent />
            <TextInput
              id="lastname"
              placeholder=""
              required={true}
              aria-label="Last name"
              label="Last name"
              value={lastName}
              setValue={(value: string) => setLastName(value)}
              isValid={isLastNameValid}
              showValidity={isLastNameValid}
              errorMessage={'Please enter your last name'}
            />
            <SpacingComponent />
            <h1 className="font-wb font-size-4"> Login details</h1>
            <TextInput
              id="email"
              placeholder=""
              required={true}
              aria-label="Email Address"
              label="Email address"
              isValid={!alreadyExists && emailValid}
              showValidity={!!email && email !== ''}
              errorMessage={emailErrorMessage()}
              value={email}
              type="email"
              setValue={(value: string) => setEmail(value)}
            />
            <SpacingComponent />
            <PasswordInput
              id="password"
              label="Password"
              value={pass}
              setValue={(value: string) => setPass(value)}
              pattern={passwordPolicy.toString()}
              isValid={!commonPassword && passQualifies}
              showValidity={!!pass && pass !== ''}
              errorMessage={passwordErrorMessage()}
            />
            <ul>
              <li className="font-hnl font-size-6">One lowercase character</li>
              <li className="font-hnl font-size-6">One uppercase character</li>
              <li className="font-hnl font-size-6">One number</li>
              <li className="font-hnl font-size-6">8 characters minimum</li>
            </ul>
            <SpacingComponent />
            <CheckboxRadio
              type="checkbox"
              id="T&Cs"
              checked={consent}
              onChange={() => setConsent(!consent)}
              name="Terms and Conditions"
              value={''}
              text={
                <>
                  I have read and agreed to the{' '}
                  <a
                    href="https://wellcome.org/about-us/governance/privacy-and-terms"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Privacy and Terms
                  </a>{' '}
                  for Wellcome Collection.
                </>
              }
            />
            <SpacingComponent />
            <SolidButton onClick={createAccount}>Create Account</SolidButton>
            <SpacingComponent />
            <input type="submit" value="Submit" hidden={true} />
          </form>
        </>
      )}
    </PageWrapper>
  );
};
