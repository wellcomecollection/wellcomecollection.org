import React from 'react';
import { useForm } from 'react-hook-form';
import { useUpdateUserInfo } from '../../../hooks/useUpdateUserInfo';
import { EditedUserInfo } from '../../../types/UserInfo';
import { useUserInfo } from '../UserInfoContext';

type EditProfileInputs = EditedUserInfo;

export function Profile(): JSX.Element {
  const { user, isLoading } = useUserInfo();
  const { register, handleSubmit } = useForm<EditProfileInputs>();
  const { updateUserInfo } = useUpdateUserInfo();

  if (isLoading) {
    return <p>Loading...</p>;
  }

  const onSubmit = async (formData: EditProfileInputs) => {
    await updateUserInfo(formData);
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
          ref={register}
        />
        <label htmlFor="last-name">Last name</label>
        <input
          id="last-name"
          name="lastName"
          defaultValue={user?.lastName}
          ref={register}
        />
        <label htmlFor="email">Email address</label>
        <input
          id="email"
          name="email"
          defaultValue={user?.email}
          ref={register}
        />
        <input type="submit" value="Update details" />
      </form>
    </>
  );
}
