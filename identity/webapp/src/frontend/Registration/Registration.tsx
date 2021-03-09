import React, { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { ErrorMessage } from '@hookform/error-message';
import { Link, useHistory } from 'react-router-dom';
import { AccountCreated } from './AccountCreated';
import { PageWrapper } from '../Shared/PageWrapper';
import {
  Button,
  Cancel,
  Checkbox,
  Container,
  ErrorAlert,
  FieldMargin,
  InvalidFieldAlert,
  Label,
  ExternalLink,
  PasswordRulesList,
  TextInput,
  Title,
  Wrapper,
  CheckboxLabel,
  InProgress,
} from './Registration.style';
import SpacingComponent from '@weco/common/views/components/SpacingComponent/SpacingComponent';
import Icon from '@weco/common/views/components/Icon/Icon';
import { useRegisterUser, RegistrationError } from './useRegisterUser';
import { PasswordInput } from './PasswordInput';
import { usePageTitle } from '../hooks/usePageTitle';

type RegistrationInputs = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  termsAndConditions: boolean;
};

const validEmailPattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const validPasswordPattern = /(?=.{8,})(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).*/;

export function Registration(): JSX.Element {
  const { register, control, handleSubmit, formState, setError } = useForm<RegistrationInputs>({
    defaultValues: { password: '' },
  });
  const { registerUser, isLoading, isSuccess, error: registrationError } = useRegisterUser();
  const { goBack } = useHistory();

  usePageTitle('Register for a library account');

  useEffect(() => {
    if (registrationError === RegistrationError.EMAIL_ALREADY_EXISTS) {
      setError('email', { type: 'manual', message: 'Email address already in use.' });
    }
  }, [registrationError, setError]);

  if (isSuccess) {
    return <AccountCreated />;
  }

  const createUser = (formData: RegistrationInputs) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { termsAndConditions, ...userDetails } = formData;
    registerUser(userDetails);
  };

  return (
    <PageWrapper>
      <Container>
        <Wrapper>
          <Title>Register for a library account</Title>
          {registrationError && (
            <>
              <ErrorAlert aria-labelledby="error-text">
                <Icon name="info2" />
                {registrationError === RegistrationError.EMAIL_ALREADY_EXISTS && (
                  <span id="error-text">
                    An account with this email address already exists, please <Link to="/">sign in</Link>.
                  </span>
                )}
                {registrationError === RegistrationError.PASSWORD_TOO_COMMON && 'Password is too common'}
                {registrationError === RegistrationError.UNKNOWN && 'An unknown error occurred'}
              </ErrorAlert>
              <SpacingComponent />
            </>
          )}
          <p>
            An account lets you order items from the library&apos;s closed stores and access our online subscription
            collections.
          </p>
          <p>
            The first time you come to the library, you&apos;ll need to complete your <a href="">library membership</a>.
          </p>

          <form onSubmit={handleSubmit(createUser)} noValidate>
            <FieldMargin>
              <Label htmlFor="firstName">First name</Label>
              <TextInput
                id="firstName"
                name="firstName"
                placeholder="Forename"
                ref={register({ required: 'Enter your first name.' })}
                invalid={formState.errors.firstName}
              />
              <ErrorMessage
                errors={formState.errors}
                name="firstName"
                render={({ message }) => <InvalidFieldAlert aria-label={message}>{message}</InvalidFieldAlert>}
              />
            </FieldMargin>
            <FieldMargin>
              <Label htmlFor="lastName">Last name</Label>
              <TextInput
                id="lastName"
                name="lastName"
                placeholder="Surname"
                ref={register({ required: 'Enter your last name.' })}
                invalid={formState.errors.lastName}
              />
              <ErrorMessage
                errors={formState.errors}
                name="lastName"
                render={({ message }) => <InvalidFieldAlert aria-label={message}>{message}</InvalidFieldAlert>}
              />
            </FieldMargin>
            <FieldMargin>
              <Label htmlFor="email">Email address</Label>
              <TextInput
                id="email"
                name="email"
                placeholder="myname@email.com"
                ref={register({
                  required: 'Enter an email address.',
                  pattern: {
                    value: validEmailPattern,
                    message: 'Enter a valid email address.',
                  },
                })}
                invalid={formState.errors.email}
              />
              <ErrorMessage
                errors={formState.errors}
                name="email"
                render={({ message }) => <InvalidFieldAlert aria-label={message}>{message}</InvalidFieldAlert>}
              />
            </FieldMargin>
            <FieldMargin>
              <Label htmlFor="password">Password</Label>
              <PasswordInput
                name="password"
                control={control}
                rules={{
                  required: 'Enter a password.',
                  pattern: {
                    value: validPasswordPattern,
                    message: 'Enter a valid password.',
                  },
                }}
              />
              <ErrorMessage
                errors={formState.errors}
                name="password"
                render={({ message }) => <InvalidFieldAlert>{message}</InvalidFieldAlert>}
              />
            </FieldMargin>
            <PasswordRulesList>
              <li className="font-hnl font-size-6">One lowercase character</li>
              <li className="font-hnl font-size-6">One uppercase character</li>
              <li className="font-hnl font-size-6">One number</li>
              <li className="font-hnl font-size-6">8 characters minimum</li>
            </PasswordRulesList>
            <SpacingComponent />
            <Controller
              name="termsAndConditions"
              control={control}
              defaultValue={false}
              rules={{ required: 'Accept the terms to continue.' }}
              render={({ value, onChange }) => (
                <Checkbox
                  onChange={(e: React.FormEvent<HTMLInputElement>) => onChange(e.currentTarget.checked)}
                  checked={value}
                  text={
                    <CheckboxLabel>
                      I have read and agree to the{' '}
                      <ExternalLink
                        href="https://wellcome.org/about-us/governance/privacy-and-terms"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Privacy and Terms
                      </ExternalLink>{' '}
                      for Wellcome
                    </CheckboxLabel>
                  }
                />
              )}
            />
            <ErrorMessage
              errors={formState.errors}
              name="termsAndConditions"
              render={({ message }) => <InvalidFieldAlert>{message}</InvalidFieldAlert>}
            />
            <SpacingComponent />
            {isLoading ? <InProgress>Registering...</InProgress> : <Button type="submit">Create account</Button>}
            <Cancel onClick={goBack} />
          </form>
        </Wrapper>
      </Container>
    </PageWrapper>
  );
}
