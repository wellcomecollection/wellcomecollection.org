import React, { useEffect, useState } from 'react';
import axios from 'axios';

import TabNav from '../WellcomeComponents/TabNav';
import SpacingComponent from '@weco/common/views/components/SpacingComponent/SpacingComponent';

import { ProfileForm } from './ProfileForm';
import { PasswordForm } from './PasswordForm';
import { LogoContainer } from '../Shared/LogoContainer';
import { PageWrapper } from '../Shared/PageWrapper';
import { useUserInfo } from '../hooks/useUserInfo';

// TODO: Update this to prod.
const logo = 'https://identity-public-assets-stage.s3.eu-west-1.amazonaws.com/images/wellcomecollections-150x50.png';

export const AccountManagement: React.FC = () => {
  const [idx, setIdx] = useState(0);

  const { data, isLoading, error } = useUserInfo();

  return (
    <PageWrapper>
      {isLoading && <h1>Loading...</h1>}
      {error && <h1 style={{ color: 'red' }}>{error}</h1>}
      {data && (
        <>
          <LogoContainer>
            <img src={logo} alt="Wellcome Collection Logo" height="200px" />
          </LogoContainer>
          <SpacingComponent />
          <h1 className="font-wb font-size-1">My Account</h1>
          <TabNav
            items={[
              { link: { to: '#' }, text: 'Profile', selected: idx === 0, onClick: () => setIdx(0) },
              { link: { to: '#' }, text: 'Password', selected: idx === 1, onClick: () => setIdx(1) },
            ]}
          />
          {idx === 0 && <ProfileForm {...data} />}
          {idx === 1 && <PasswordForm />}
        </>
      )}
    </PageWrapper>
  );
};
