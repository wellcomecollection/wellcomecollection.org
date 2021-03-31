import React from 'react';
import { useForm } from 'react-hook-form';
import { ErrorMessage } from '@hookform/error-message';
import { Button } from '../Button';
import { useUpdateUserInfo } from '../../hooks/useUpdateUserInfo';
import { EditedUserInfo } from '../../types/UserInfo';
import { useUserInfo } from '../../context/UserInfoContext';
import {
  Field,
  Form,
  Input,
  InvalidField,
  Label,
  Loading,
  Section,
} from './PersonalDetails.style';

const emailRegEx = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

type EditProfileInputs = EditedUserInfo;

export function PersonalDetails(): JSX.Element {
  const { user, isLoading, refetch } = useUserInfo();
  const { register, handleSubmit, errors, clearErrors } = useForm<
    EditProfileInputs
  >();
  const { updateUserInfo, isLoading: isUpdating } = useUpdateUserInfo();

  if (isLoading) {
    return (
      <Section>
        <Loading>Loading...</Loading>
      </Section>
    );
  }

  const onSubmit = async (formData: EditProfileInputs) => {
    clearErrors();
    await updateUserInfo(formData).then(refetch);
  };

  return (
    <Section>
      <h3>Personal details</h3>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Field>
          <Label htmlFor="first-name">First name</Label>
          <Input
            id="first-name"
            name="firstName"
            defaultValue={user?.firstName}
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
            defaultValue={user?.lastName}
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
            defaultValue={user?.email}
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
    </Section>
  );
}
