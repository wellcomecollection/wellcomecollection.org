import React, { useState } from 'react';
import styled from 'styled-components';
import { SolidButton } from '@weco/common/views/components/ButtonSolid/ButtonSolid';
import SpacingComponent from '@weco/common/views/components/SpacingComponent/SpacingComponent';
import { PasswordInput } from '../Shared/PasswordInput';

// TODO: Update this to prod.
const logo = 'https://identity-public-assets-stage.s3.eu-west-1.amazonaws.com/images/wellcomecollections-150x50.png';

const LogoContainer = styled.div`
  display: flex;
  width: 200px;
`;

export const DeleteAccount = (): JSX.Element => {
  const [password, setPassword] = useState('');

  return (
    <div>
      <LogoContainer>
        <img src={logo} alt="Wellcome Collection Logo" height="200px" />
      </LogoContainer>
      <SpacingComponent />
      <h1 className="font-wb font-size-1">Delete Account</h1>
      <SpacingComponent />
      <p>Are you sure you want to delete your account?</p>
      <p>To permanently delete your account please enter your password and confirm.</p>
      <PasswordInput label="Password" id="password" value={password} setValue={setPassword} />
      <SolidButton>Yes, delete my account</SolidButton>
      <SpacingComponent />
      <a href="TBC">Cancel</a>
    </div>
  );
};
