import CheckboxRadio from '@weco/common/views/components/CheckboxRadio/CheckboxRadio';
import SpacingComponent from '@weco/common/views/components/SpacingComponent/SpacingComponent';
import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { AccountCreated } from './AccountCreated';
import {
  Button,
  Container,
  ErrorMessage,
  Heading,
  InvalidFieldAlert,
  Label,
  Link,
  SecondaryButton,
  TextInput,
  Title,
  Wrapper,
} from './Registration.style';
import { useRegisterUser } from './useRegisterUser';

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
  const { register, control, handleSubmit, errors } = useForm<RegistrationInputs>();
  const { registerUser, isSuccess, emailAlreadyExists, error: submissionError } = useRegisterUser();

  const createUser = (formData: RegistrationInputs) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { termsAndConditions, ...userDetails } = formData;
    registerUser(userDetails);
  };

  if (isSuccess) {
    return <AccountCreated />;
  }

  return (
    <Container>
      <Wrapper>
        <Title>Register for Wellcome</Title>
        {emailAlreadyExists && (
          <>
            <ErrorMessage>
              That account already exists - you can try to <a href="#">login</a>
            </ErrorMessage>
            <SpacingComponent />
          </>
        )}
        {submissionError && <ErrorMessage>An unknown error occurred</ErrorMessage>}
        <form onSubmit={handleSubmit(createUser)}>
          <Heading>Personal details</Heading>

          <Label htmlFor="first-name">First name</Label>
          {errors.firstName && <InvalidFieldAlert>{errors.firstName.message}</InvalidFieldAlert>}
          <TextInput
            id="first-name"
            name="firstName"
            placeholder="Forename"
            ref={register({ required: 'Missing first name' })}
            data-invalid={Boolean(errors.firstName)}
          />

          <Label htmlFor="last-name">Last name</Label>
          {errors.lastName && <InvalidFieldAlert>{errors.lastName.message}</InvalidFieldAlert>}
          <TextInput
            id="last-name"
            name="lastName"
            placeholder="Surname"
            ref={register({ required: 'Missing last name' })}
            data-invalid={Boolean(errors.lastName)}
          />

          <SpacingComponent />

          <Heading>Login details</Heading>

          <Label htmlFor="email-address" className="font-hnm font-size-4">
            Email address
          </Label>
          {errors.email && <InvalidFieldAlert>{errors.email.message}</InvalidFieldAlert>}
          <TextInput
            id="email-address"
            name="email"
            type="email"
            placeholder="myname@email.com"
            ref={register({
              required: 'Missing email address',
              pattern: {
                value: validEmailPattern,
                message: 'Invalid email address',
              },
            })}
            data-invalid={Boolean(errors.email)}
          />

          <Label htmlFor="password" className="font-hnm font-size-4">
            Password
          </Label>
          {errors.password && <InvalidFieldAlert>{errors.password.message}</InvalidFieldAlert>}
          <TextInput
            id="password"
            name="password"
            type="password"
            ref={register({
              required: 'Missing password',
              pattern: {
                value: validPasswordPattern,
                message: 'Invalid password',
              },
            })}
            data-invalid={Boolean(errors.password)}
          />

          <SpacingComponent />

          {errors.termsAndConditions && <InvalidFieldAlert>{errors.termsAndConditions.message}</InvalidFieldAlert>}
          <Controller
            name="termsAndConditions"
            control={control}
            defaultValue={false}
            rules={{ required: 'You must accept to proceed' }}
            render={(props) => (
              <CheckboxRadio
                onChange={(e: React.FormEvent<HTMLInputElement>) => props.onChange(e.currentTarget.checked)}
                checked={props.value}
                type="checkbox"
                text={
                  <span>
                    I have read and agree to the <Link href="#">Privacy and Terms</Link> for Wellcome
                  </span>
                }
              />
            )}
          />

          <SpacingComponent />

          <Button type="submit">Create account</Button>
          <SpacingComponent />
          <SecondaryButton type="reset">Cancel</SecondaryButton>
        </form>
      </Wrapper>
    </Container>
  );
}
