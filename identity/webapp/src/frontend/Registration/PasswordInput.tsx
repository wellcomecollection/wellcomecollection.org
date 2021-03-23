import React, { useState } from 'react';
import styled from 'styled-components';
import WellcomeTextInput from '@weco/common/views/components/TextInput/TextInput';
import { OutlinedButton } from '@weco/common/views/components/ButtonOutlined/ButtonOutlined';
import OpenEye from '@weco/common/icons/components/Eye';
import ClosedEye from '@weco/common/icons/components/A11yVisual';

const PasswordInputContainer = styled.div`
  display: flex;

  & > div {
    width: 100%;
    margin-right: 1em;
  }
`;

const VisibilityButton = styled(OutlinedButton).attrs({ type: 'button' })`
  height: 55px;
`;

type PasswordInputProps = React.ComponentPropsWithRef<typeof WellcomeTextInput>;

export const PasswordInput: React.FC<PasswordInputProps> = props => {
  const [isVisible, setIsVisible] = useState(false);

  const toggleIsVisible = () => setIsVisible(wasVisible => !wasVisible);

  const VisibilityIcon = isVisible ? ClosedEye : OpenEye;

  return (
    <PasswordInputContainer>
      <WellcomeTextInput {...props} type={isVisible ? 'text' : 'password'} />
      <VisibilityButton onClick={toggleIsVisible}>
        <VisibilityIcon width="24" height="24" />
      </VisibilityButton>
    </PasswordInputContainer>
  );
};
