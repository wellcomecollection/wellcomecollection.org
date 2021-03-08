import React, { useEffect } from 'react';
import { useForm, Controller, RegisterOptions } from 'react-hook-form';
import { ErrorMessage } from '@hookform/error-message';
import { Link } from 'react-router-dom';
import { AccountCreated } from './AccountCreated';
import { PageWrapper } from './PageWrapper';
import {
  Button,
  Checkbox,
  Container,
  ErrorAlert,
  FieldMargin,
  InvalidFieldAlert,
  Label,
  Link as ExternalLink,
  PasswordRulesList,
  SecondaryButton,
  TextInput,
  Title,
  Wrapper,
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
  const { registerUser, isSuccess, error: registrationError } = useRegisterUser();

  usePageTitle('Register for a library account');

  useEffect(() => {
    if (registrationError === RegistrationError.EMAIL_ALREADY_EXISTS) {
      setError('email', { type: 'manual', message: 'Email address already in use.' });
    }
  }, [registrationError, setError]);

  if (isSuccess) {
    return <AccountCreated />;
  }

  const Field: React.FC<{
    name: keyof RegistrationInputs;
    label: string;
    type?: string;
    placeholder?: string;
    rules: RegisterOptions;
  }> = ({ name, label, type = 'text', placeholder, rules }) => {
    return (
      <FieldMargin>
        <Label htmlFor={name}>{label}</Label>
        <TextInput
          id={name}
          name={name}
          type={type}
          placeholder={placeholder}
          ref={register(rules)}
          invalid={formState.errors[name]}
        />
        <ErrorMessage
          errors={formState.errors}
          name={name}
          render={({ message }) => <InvalidFieldAlert aria-label={message}>{message}</InvalidFieldAlert>}
        />
      </FieldMargin>
    );
  };

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
            <Field
              name="firstName"
              label="First name"
              placeholder="Forename"
              rules={{ required: 'Enter your first name.' }}
            />
            <Field
              name="lastName"
              label="Last name"
              placeholder="Surname"
              rules={{ required: 'Enter your last name.' }}
            />
            <Field
              name="email"
              type="email"
              label="Email address"
              placeholder="myname@email.com"
              rules={{
                required: 'Enter an email address.',
                pattern: {
                  value: validEmailPattern,
                  message: 'Enter a valid email address.',
                },
              }}
            />
            <FieldMargin>
              <Label htmlFor="password" className="font-hnm font-size-4">
                Password
              </Label>
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
                    <span>
                      I have read and agree to the{' '}
                      <ExternalLink
                        href="https://wellcome.org/about-us/governance/privacy-and-terms"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Privacy and Terms
                      </ExternalLink>{' '}
                      for Wellcome
                    </span>
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
            <Button type="submit">Create account</Button>
            <SpacingComponent />
            <SecondaryButton type="reset">Cancel</SecondaryButton>
          </form>
        </Wrapper>
      </Container>
    </PageWrapper>
  );
}
