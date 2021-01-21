import React from 'react';
import SpacingComponent from '@weco/common/views/components/SpacingComponent/SpacingComponent';
import { SolidButton } from '@weco/common/views/components/ButtonSolid/ButtonSolid';

export const AdminAccountCreated: React.FC<{ createAnother: () => void }> = ({ createAnother }) => {
  return (
    <>
      <SpacingComponent />
      <h1 className="font-wb font-size-1">Success - Account Created</h1>
      <SpacingComponent />
      <SolidButton onClick={createAnother}>Create Another</SolidButton>
    </>
  );
};
