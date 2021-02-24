import React from 'react';
import { useForm } from 'react-hook-form';
import { useUpdateUserInfo } from '../../../hooks/useUpdateUserInfo';
import { EditedUserInfo } from '../../../types/UserInfo';
import { useUserInfo } from '../UserInfoContext';
import { Form, Input, InvalidField, Label } from './Profile.style';

const emailRegEx = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

type EditProfileInputs = EditedUserInfo;

export function Profile(): JSX.Element {
  const { user, isLoading, refetch } = useUserInfo();
  const { register, handleSubmit, errors, clearErrors } = useForm<
    EditProfileInputs
  >();
  const { updateUserInfo, isLoading: isUpdating } = useUpdateUserInfo();

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (isUpdating) {
    return <p>Updating...</p>;
  }

  const onSubmit = async (formData: EditProfileInputs) => {
    clearErrors();
    await updateUserInfo(formData).then(refetch);
  };

  return (
    <>
      <h3>Library card number</h3>
      <p>{user?.barcode}</p>
      <h3>Patron record number</h3>
      <p>{user?.patronId}</p>
      <h3>Personal details</h3>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Label htmlFor="first-name">First name</Label>
        <Input
          id="first-name"
          name="firstName"
          defaultValue={user?.firstName}
          ref={register({ required: 'First name cannot be blank' })}
        />
        {errors.firstName && (
          <InvalidField>{errors.firstName.message}</InvalidField>
        )}
        <Label htmlFor="last-name">Last name</Label>
        <Input
          id="last-name"
          name="lastName"
          defaultValue={user?.lastName}
          ref={register({ required: 'Last name cannot be blank' })}
        />
        {errors.lastName && (
          <InvalidField>{errors.lastName.message}</InvalidField>
        )}
        <Label htmlFor="email">Email address</Label>
        <Input
          id="email"
          name="email"
          defaultValue={user?.email}
          ref={register({
            required: 'Email address cannot be blank',
            pattern: {
              value: emailRegEx,
              message: 'Invalid email address',
            },
          })}
        />
        {errors.email && <InvalidField>{errors.email.message}</InvalidField>}
        <button type="submit">Update details</button>
      </Form>
    </>
  );
}
