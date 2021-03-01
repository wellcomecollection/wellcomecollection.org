import React from 'react';
import { useForm } from 'react-hook-form';
import { AccountCreated } from './AccountCreated';
import { useRegisterUser } from './useRegisterUser';

type RegistrationInputs = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  termsAndConditions: boolean;
};

const InvalidFieldAlert: React.FC<{ children: React.ReactNode }> = ({ children }) => <div role="alert">{children}</div>;
const ErrorMessage: React.FC<{ children: React.ReactNode }> = ({ children }) => <div role="alert">{children}</div>;

const validEmailPattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const validPasswordPattern = /(?=.{8,})(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).*/;

export function Registration(): JSX.Element {
  const { register, handleSubmit, errors } = useForm<RegistrationInputs>();
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
    <>
      <h1>Register for Wellcome</h1>
      {emailAlreadyExists && (
        <ErrorMessage>
          That account already exists - you can try to <a href="#">login</a>
        </ErrorMessage>
      )}
      {submissionError && <ErrorMessage>An unknown error occurred</ErrorMessage>}
      <form onSubmit={handleSubmit(createUser)}>
        <h2>Personal details</h2>
        <label htmlFor="first-name">First name</label>
        <input
          id="first-name"
          name="firstName"
          placeholder="Forename"
          ref={register({ required: 'Missing first name' })}
        />
        {errors.firstName && <InvalidFieldAlert>{errors.firstName.message}</InvalidFieldAlert>}
        <label htmlFor="last-name">Last name</label>
        <input id="last-name" name="lastName" placeholder="Surname" ref={register({ required: 'Missing last name' })} />
        {errors.lastName && <InvalidFieldAlert>{errors.lastName.message}</InvalidFieldAlert>}
        <h2>Login details</h2>
        <label htmlFor="email-address">Email address</label>
        <input
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
        />
        {errors.email && <InvalidFieldAlert>{errors.email.message}</InvalidFieldAlert>}
        <label htmlFor="password">Password</label>
        <input
          id="password"
          name="password"
          ref={register({
            required: 'Missing password',
            pattern: {
              value: validPasswordPattern,
              message: 'Invalid password',
            },
          })}
        />
        {errors.password && <InvalidFieldAlert>{errors.password.message}</InvalidFieldAlert>}
        <input
          type="checkbox"
          name="termsAndConditions"
          id="terms-and-conditions"
          aria-labelledby="accepting-statement"
          ref={register({ required: 'You must accept to proceed' })}
        />
        <span id="accepting-statement">
          I have read and agree to the <a href="#">Privacy and Terms</a> for Wellcome
        </span>
        {errors.termsAndConditions && <InvalidFieldAlert>{errors.termsAndConditions.message}</InvalidFieldAlert>}
        <button type="submit">Create account</button>
      </form>
    </>
  );
}
