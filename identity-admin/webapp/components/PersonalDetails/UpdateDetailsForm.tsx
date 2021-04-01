import { ErrorMessage } from '@hookform/error-message';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { EditedUser, User } from '../../interfaces';
import { Button } from '../Button';
import {
  Field,
  Form,
  Input,
  InvalidField,
  Label,
} from './PersonalDetails.style';

const emailRegEx = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

type UpdateDetailsFormProps = {
  user?: User;
  isUpdating: boolean;
  onSubmit: (formData: EditedUser) => void;
};

export const UpdateDetailsForm: React.FC<UpdateDetailsFormProps> = ({
  user,
  isUpdating,
  onSubmit: propOnSubmit,
}) => {
  const { register, handleSubmit, errors, clearErrors, reset } = useForm<
    EditedUser
  >({ defaultValues: user });

  useEffect(() => {
    reset(user);
  }, [user]);

  const onSubmit = (formData: EditedUser) => {
    clearErrors();
    propOnSubmit(formData);
  };

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <Field>
        <Label htmlFor="first-name">First name</Label>
        <Input
          id="first-name"
          name="firstName"
          disabled={isUpdating}
          ref={register({ required: 'First name cannot be blank' })}
        />
        <ErrorMessage
          errors={errors}
          name="firstName"
          render={({ message }) => <InvalidField>{message}</InvalidField>}
        />
      </Field>
      <Field>
        <Label htmlFor="last-name">Last name</Label>
        <Input
          id="last-name"
          name="lastName"
          disabled={isUpdating}
          ref={register({ required: 'Last name cannot be blank' })}
        />
        <ErrorMessage
          errors={errors}
          name="lastName"
          render={({ message }) => <InvalidField>{message}</InvalidField>}
        />
      </Field>
      <Field>
        <Label htmlFor="email">Email address</Label>
        <Input
          id="email"
          name="email"
          disabled={isUpdating}
          ref={register({
            required: 'Email address cannot be blank',
            pattern: {
              value: emailRegEx,
              message: 'Invalid email address',
            },
          })}
        />
        <ErrorMessage
          errors={errors}
          name="email"
          render={({ message }) => <InvalidField>{message}</InvalidField>}
        />
      </Field>
      <Field>
        <Button type="submit" disabled={isUpdating}>
          {isUpdating ? 'Updating...' : 'Update details'}
        </Button>
      </Field>
    </Form>
  );
};
