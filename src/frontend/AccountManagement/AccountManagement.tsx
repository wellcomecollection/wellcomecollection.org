import React, { useState } from 'react';

// @ts-ignore
import SectionHeader from '@weco/common/views/components/SectionHeader/SectionHeader';
// @ts-ignore
import TabNav from '@weco/common/views/components/TabNav/TabNav';
import SpacingComponent from '@weco/common/views/components/SpacingComponent/SpacingComponent';

import { ProfileForm } from './ProfileForm';
import { PasswordForm } from './PasswordForm';

// TODO: Update this to prod.
const logo = 'https://identity-public-assets-stage.s3.eu-west-1.amazonaws.com/images/wellcomecollections-150x50.png';
import styled from 'styled-components';

const LogoContainer = styled.div`
   {
    display: flex;
    width: 200px;
  }
`;

export const AccountManagement: React.FC<{
  existingTitle: string;
  existingFirstName: string;
  existingLastName: string;
  existingEmail: string;
}> = ({ existingTitle, existingFirstName, existingLastName, existingEmail }) => {
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
            { link: '#', text: 'Profile', selected: idx === 0, onClick: () => setIdx(0) },
            { link: '#', text: 'Password', selected: idx === 1, onClick: () => setIdx(1) },
          ]}
        />
        {idx === 0 ? (
          <ProfileForm
            existingTitle={existingTitle}
            existingFirstName={existingFirstName}
            existingLastName={existingLastName}
            existingEmail={existingEmail}
          />
        ) : (
          <></>
        )}
        {idx === 1 ? <PasswordForm /> : <></>}
      </>
    </div>
  );
};
