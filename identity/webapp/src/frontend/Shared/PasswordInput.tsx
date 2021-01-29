import React, { useState } from 'react';
import styled from 'styled-components';
import TextInput, { TextInputProps } from '../WellcomeComponents/TextInput';
import EyeIcon from '@weco/common/icons/components/Eye';
import AllyVisual from '@weco/common/icons/components/A11yVisual';

const PasswordFieldWrapper = styled.div`
  display: grid;
`;

const IconWrapper = styled.div`
  height: 30px;
  width: 30px;
  justify-self: end;
  transform: translate(-35px, 50px);
  z-index: 10;
  margin-top: -35px;
`;

export const PasswordInput: React.FC<TextInputProps> = (props) => {
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const toggleShowPassword = () => setShowPassword(!showPassword);

  return (
    <PasswordFieldWrapper>
      <IconWrapper>
        {showPassword ? <AllyVisual onClick={toggleShowPassword} /> : <EyeIcon onClick={toggleShowPassword} />}
      </IconWrapper>
      <TextInput {...props} placeholder="" required={true} type={showPassword ? 'text' : 'password'} />
    </PasswordFieldWrapper>
  );
};
