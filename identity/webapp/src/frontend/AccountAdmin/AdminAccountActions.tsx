import React from 'react';

import { SolidButton } from '@weco/common/views/components/ButtonSolid/ButtonSolid';
import { OutlinedButton } from '@weco/common/views/components/ButtonOutlined/ButtonOutlined';

import SpacingComponent from '@weco/common/views/components/SpacingComponent/SpacingComponent';

export const AdminAccountActions = () => {
  return (
    <div>
      <SpacingComponent />
      <OutlinedButton>Resend activation email </OutlinedButton>
      <SpacingComponent />
      <OutlinedButton>Block account</OutlinedButton>
      <SpacingComponent />
      <SolidButton>Delete account</SolidButton>
      <SpacingComponent />
    </div>
  );
};
