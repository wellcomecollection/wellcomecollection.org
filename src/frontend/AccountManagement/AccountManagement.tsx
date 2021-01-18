import React, { useState } from 'react';

import TabNav from '../WellcomeComponents/TabNav';
import SpacingComponent from '@weco/common/views/components/SpacingComponent/SpacingComponent';

import { ProfileForm } from './ProfileForm';
import { PasswordForm } from './PasswordForm';
import { LogoContainer } from '../Shared/LogoContainer';

// TODO: Update this to prod.
const logo = 'https://identity-public-assets-stage.s3.eu-west-1.amazonaws.com/images/wellcomecollections-150x50.png';


export type UserInfo = {
  firstName: string;
  lastName: string;
  emailAddress: string;
  libraryCardNumber: string;
};

export const AccountManagement: React.FC<UserInfo> = (props) => {
  const [idx, setIdx] = useState(0);

  return (
    <div>
      <LogoContainer>
        <img src={logo} alt="Wellcome Collection Logo" height="200px" />
      </LogoContainer>
      <SpacingComponent />
      <h1 className="font-wb font-size-1">My Account</h1>
      <>
        <TabNav
          items={[
            { link: { to: '#' }, text: 'Profile', selected: idx === 0, onClick: () => setIdx(0) },
            { link: { to: '#' }, text: 'Password', selected: idx === 1, onClick: () => setIdx(1) },
          ]}
        />
        {idx === 0 && <ProfileForm {...props} />}
        {idx === 1 && <PasswordForm />}
      </>
    </div>
  );
};
