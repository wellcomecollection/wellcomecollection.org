import React from 'react';

import { SolidButton } from '@weco/common/views/components/ButtonSolid/ButtonSolid';
import SpacingComponent from '@weco/common/views/components/SpacingComponent/SpacingComponent';

// TODO: Update this to prod.
const logo = 'https://identity-public-assets-stage.s3.eu-west-1.amazonaws.com/images/wellcomecollections-150x50.png';
import styled from 'styled-components';

const LogoContainer = styled.div`
   {
    display: flex;
    width: 200px;
  }
`;

export const DeleteAccount = () => {
  return (
    <div>
      <LogoContainer>
        <img src={logo} alt="Wellcome Collection Logo" height="200px" />
      </LogoContainer>
      <SpacingComponent />

      <h1 className="font-wb font-size-1">Delete Account</h1>
      <SpacingComponent />
      <p>Are you sure you want to delete your account?</p>
      <SolidButton>Yes, delete my account</SolidButton>
      <SpacingComponent />
      <a href="TBC">Cancel</a>
    </div>
  );
};
