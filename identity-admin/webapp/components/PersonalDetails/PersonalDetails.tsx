import React from 'react';
import { useUpdateUserInfo } from '../../hooks/useUpdateUserInfo';
import { useUserInfo } from '../../context/UserInfoContext';
import { Loading, Section } from './PersonalDetails.style';
import { EditedUserInfo } from '../../types/UserInfo';
import { UpdateDetailsForm } from './UpdateDetailsForm';

export function PersonalDetails(): JSX.Element {
  const { user, isLoading, refetch } = useUserInfo();

  const { updateUserInfo, isLoading: isUpdating } = useUpdateUserInfo();

  const onSubmit = async (formData: EditedUserInfo) => {
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
