import React, { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { ErrorMessage } from '@hookform/error-message';
import { Link, useHistory } from 'react-router-dom';
import { AccountCreated } from './AccountCreated';
import { PageWrapper } from '../components/PageWrapper';
import { Cancel, Checkbox, ErrorAlert, ExternalLink, CheckboxLabel, InProgress } from './Registration.style';
import { InvalidFieldAlert, Button } from '../components/Form.style';
import { Container, Title, Wrapper } from '../components/Layout.style';
import SpacingComponent from '@weco/common/views/components/SpacingComponent/SpacingComponent';
import WellcomeTextInput from '@weco/common/views/components/TextInput/TextInput';
import Info2 from '@weco/common/icons/components/Info2';
import { useRegisterUser, RegistrationError } from './useRegisterUser';
import { usePageTitle } from '../hooks/usePageTitle';
import { validEmailPattern, validPasswordPattern } from '../components/ValidationPatterns';
import { PasswordRules } from '../components/PasswordInput';
import { PasswordInput } from './PasswordInput';

const scrollToTop = () => window.scrollTo(0, 0);

type RegistrationInputs = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  termsAndConditions: boolean;
};

export function Registration(): JSX.Element {
  const { control, trigger, handleSubmit, formState, setError } = useForm<RegistrationInputs>({
    defaultValues: { password: '' },
  });
  const { registerUser, isLoading, isSuccess, error: registrationError } = useRegisterUser();
  const { goBack } = useHistory();

  usePageTitle('Register for a library account');

  useEffect(() => {
    scrollToTop();
    if (registrationError === RegistrationError.EMAIL_ALREADY_EXISTS) {
      setError('email', { type: 'manual', message: 'Email address already in use.' });
    }
  }, [registrationError, setError]);

  if (isSuccess) {
    scrollToTop();
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
                <Info2 />
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
            <Controller
              name="firstName"
              control={control}
              defaultValue=""
              rules={{ required: 'Enter your first name.' }}
              render={({ onChange, value, name }, { invalid, isDirty }) => (
                <WellcomeTextInput
                  required
                  id={name}
                  label="First name"
                  value={value}
                  setValue={onChange}
                  isValid={!invalid}
                  setIsValid={() => trigger('firstName')}
                  showValidity={isDirty || formState.isSubmitted}
                  errorMessage={formState.errors.firstName?.message}
                />
              )}
            />
            <SpacingComponent />

            <Controller
              name="lastName"
              control={control}
              defaultValue=""
              rules={{ required: 'Enter your last name.' }}
              render={({ onChange, value, name }, { invalid, isDirty }) => (
                <WellcomeTextInput
                  required
                  id={name}
                  label="Last name"
                  value={value}
                  setValue={onChange}
                  isValid={!invalid}
                  setIsValid={() => trigger('lastName')}
                  showValidity={isDirty || formState.isSubmitted}
                  errorMessage={formState.errors.lastName?.message}
                />
              )}
            />
            <SpacingComponent />

            <Controller
              name="email"
              control={control}
              defaultValue=""
              rules={{
                required: 'Enter an email address.',
                pattern: {
                  value: validEmailPattern,
                  message: 'Enter a valid email address.',
                },
              }}
              render={({ onChange, value, name }, { invalid, isDirty }) => (
                <WellcomeTextInput
                  required
                  id={name}
                  label="Email address"
                  value={value}
                  setValue={onChange}
                  isValid={!invalid}
                  setIsValid={() => trigger('email')}
                  showValidity={isDirty || formState.isSubmitted}
                  errorMessage={formState.errors.email?.message}
                />
              )}
            />
            <SpacingComponent />

            <Controller
              name="password"
              control={control}
              defaultValue=""
              rules={{
                required: 'Enter a password.',
                pattern: {
                  value: validPasswordPattern,
                  message: 'Enter a valid password.',
                },
              }}
              render={({ onChange, value, name }, { invalid, isDirty }) => {
                return (
                  <PasswordInput
                    required
                    id={name}
                    type="password"
                    label="Password"
                    value={value}
                    setValue={onChange}
                    isValid={!invalid}
                    setIsValid={() => trigger('password')}
                    showValidity={isDirty || formState.isSubmitted}
                    errorMessage={formState.errors.password?.message}
                  />
                );
              }}
            />
            <PasswordRules />
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
            {isLoading ? <InProgress>Creating account…</InProgress> : <Button type="submit">Create account</Button>}
            <Cancel onClick={goBack} />
          </form>
        </Wrapper>
      </Container>
    </PageWrapper>
  );
}
