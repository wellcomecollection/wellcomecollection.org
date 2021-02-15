import React, { useState } from 'react';
import styled from 'styled-components';
import { SolidButton } from '@weco/common/views/components/ButtonSolid/ButtonSolid';
import SpacingComponent from '@weco/common/views/components/SpacingComponent/SpacingComponent';
import { PasswordInput } from '../Shared/PasswordInput';
import { useRequestDelete } from '../hooks/useRequestDelete';
import { ErrorMessage } from '../Shared/ErrorMessage';

// TODO: Update this to prod.
const logo = 'https://identity-public-assets-stage.s3.eu-west-1.amazonaws.com/images/wellcomecollections-150x50.png';

const LogoContainer = styled.div`
  display: flex;
  width: 200px;
`;

export const DeleteAccount: React.FC = () => {
  const [password, setPassword] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [isIncorrectPassword, setIsIncorrectPassword] = useState(false);
  const [requestDelete] = useRequestDelete();

  const handlePasswordChange = (enteredValue: string) => {
    setIsIncorrectPassword(false);
    setPassword(enteredValue);
  };

  const handleSuccess = () => setIsSuccess(true);
  const handleFailure = (statusCode?: number) => {
    switch (statusCode) {
      case 401: {
        setIsIncorrectPassword(true);
        setPassword('');
        break;
      }
      default: {
        console.error('Error');
      }
    }
  };

  const handleConfirmDelete = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    requestDelete({ password }, handleSuccess, handleFailure);
  };

  return (
    <div>
      <LogoContainer>
        <img src={logo} alt="Wellcome Collection Logo" height="200px" />
      </LogoContainer>
      <SpacingComponent />
      <h1 className="font-wb font-size-1">Delete Account</h1>
      <SpacingComponent />
      {isSuccess ? (
        <>
          <p>Your request for account deletion has been received.</p>
          <p>
            Our Library enquiries team will now progress your request. If there are any issues they will be in touch
            otherwise your account will be removed.
          </p>
        </>
      ) : (
        <>
          <p>Are you sure you want to delete your account?</p>
          <p>To permanently delete your account please enter your password and confirm.</p>
          <form onSubmit={handleConfirmDelete}>
            <PasswordInput label="Password" id="password" value={password} setValue={handlePasswordChange} />
            {isIncorrectPassword && <ErrorMessage>Incorrect password</ErrorMessage>}
            <SolidButton type="submit">Yes, delete my account</SolidButton>
          </form>
          <SpacingComponent />
          <a href="TBC">Cancel</a>
        </>
      )}
    </div>
  );
};
