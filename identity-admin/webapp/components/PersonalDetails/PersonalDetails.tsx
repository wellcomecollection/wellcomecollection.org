import React from 'react';
import { useUpdateUserInfo } from '../../hooks/useUpdateUserInfo';
import { useUserInfo } from '../../context/UserInfoContext';
import { Loading, Section } from './PersonalDetails.style';
import { EditedUser } from '../../interfaces';
import { UpdateDetailsForm } from './UpdateDetailsForm';

export function PersonalDetails(): JSX.Element {
  const { user, isLoading, refetch } = useUserInfo();

  const { updateUserInfo, isLoading: isUpdating } = useUpdateUserInfo();

  const onSubmit = async (formData: EditedUser) => {
    await updateUserInfo(formData).then(refetch);
  };

  return (
    <Section>
      <h3>Personal details</h3>
      {isLoading ? (
        <Loading>Loading...</Loading>
      ) : (
        <UpdateDetailsForm
          user={user}
          isUpdating={isUpdating}
          onSubmit={onSubmit}
        />
      )}
    </Section>
  );
}
