import React from 'react';
import { useForm } from 'react-hook-form';
import { useUpdateUserInfo } from '../../../hooks/useUpdateUserInfo';
import { EditedUserInfo } from '../../../types/UserInfo';
import { useUserInfo } from '../UserInfoContext';

const emailRegEx = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

type EditProfileInputs = EditedUserInfo;

const InvalidField: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return <div role="alert">{children}</div>;
};

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
      <form onSubmit={handleSubmit(onSubmit)}>
        <label htmlFor="first-name">First name</label>
        <input
          id="first-name"
          name="firstName"
          defaultValue={user?.firstName}
          ref={register({ required: 'First name cannot be blank' })}
        />
        {errors.firstName && (
          <InvalidField>{errors.firstName.message}</InvalidField>
        )}
        <label htmlFor="last-name">Last name</label>
        <input
          id="last-name"
          name="lastName"
          defaultValue={user?.lastName}
          ref={register({ required: 'Last name cannot be blank' })}
        />
        {errors.lastName && (
          <InvalidField>{errors.lastName.message}</InvalidField>
        )}
        <label htmlFor="email">Email address</label>
        <input
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
        <input type="submit" value="Update details" />
      </form>
    </>
  );
}
