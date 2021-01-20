import React, { useState, ReactNode } from 'react';
import styled from 'styled-components';
import TextInput from '@weco/common/views/components/TextInput/TextInput';
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

type PasswordInputProps = {
  label?: string;
  value: string | undefined;
  setValue: (value: string) => void;
  pattern?: RegExp;
  showValidity?: boolean;
  isValid?: boolean;
  errorMessage?: string | ReactNode;
};

export const PasswordInput: React.FC<PasswordInputProps> = (props) => {
  const { label = 'Password' } = props;
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const toggleShowPassword = () => setShowPassword(!showPassword);

  return (
    <PasswordFieldWrapper>
      <IconWrapper>
        {showPassword ? <AllyVisual onClick={toggleShowPassword} /> : <EyeIcon onClick={toggleShowPassword} />}
      </IconWrapper>
      <TextInput
        placeholder=""
        required={true}
        aria-label={label}
        label={label}
        type={showPassword ? 'text' : 'password'}
        style={{ width: '100%' }}
        {...props}
      />
    </PasswordFieldWrapper>
  );
};
