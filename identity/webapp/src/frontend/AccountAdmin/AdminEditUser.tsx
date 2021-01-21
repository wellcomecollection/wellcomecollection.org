import React, { useState } from 'react';

// @ts-ignore
import SectionHeader from '@weco/common/views/components/SectionHeader/SectionHeader';
// @ts-ignore
import TabNav from '@weco/common/views/components/TabNav/TabNav';
import SpacingComponent from '@weco/common/views/components/SpacingComponent/SpacingComponent';

import { AdminProfileForm } from './AdminProfileForm';

// TODO: Update this to prod.
const logo = 'https://identity-public-assets-stage.s3.eu-west-1.amazonaws.com/images/wellcomecollections-150x50.png';
import styled from 'styled-components';
import { AdminAccountActions } from './AdminAccountActions';

const LogoContainer = styled.div`
   {
    display: flex;
    width: 200px;
  }
`;

export const AdminEditUser: React.FC<{
  existingTitle: string;
  existingFirstName: string;
  existingLastName: string;
  existingPatronType: string;
  existingGeographicArea: string;
  existingSourceLocation: string;
  existingInterest: string;
  existingUserCategory: string;
  existingEmail: string;
}> = ({
  existingTitle,
  existingFirstName,
  existingLastName,
  existingEmail,
  existingPatronType,
  existingGeographicArea,
  existingSourceLocation,
  existingInterest,
  existingUserCategory,
}) => {
  const [idx, setIdx] = useState(0);

  return (
    <div>
      <LogoContainer>
        <img src={logo} alt="Wellcome Collection Logo" height="200px" />
      </LogoContainer>
      <SpacingComponent />
      <h1 className="font-wb font-size-1">Account Administration</h1>
      <SectionHeader title={`Edit user profile: ${existingFirstName} ${existingLastName}`} />
      <>
        <TabNav
          items={[
            { link: '#', text: 'Profile', selected: idx === 0, onClick: () => setIdx(0) },
            { link: '#', text: 'Usage data', selected: idx === 1, onClick: () => setIdx(1) },
            { link: '#', text: 'Account actions', selected: idx === 2, onClick: () => setIdx(2) },
          ]}
        />
        {idx === 0 ? (
          <AdminProfileForm
            existingTitle={existingTitle}
            existingFirstName={existingFirstName}
            existingLastName={existingLastName}
            existingEmail={existingEmail}
            existingPatronType={existingPatronType}
            existingGeographicArea={existingGeographicArea}
            existingSourceLocation={existingSourceLocation}
            existingInterest={existingInterest}
            existingUserCategory={existingUserCategory}
          />
        ) : (
          <></>
        )}
        {idx === 2 ? <AdminAccountActions /> : <></>}
      </>
    </div>
  );
};
