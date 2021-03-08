import React, { useState } from 'react';
import { useController, UseControllerOptions } from 'react-hook-form';
import OpenEye from '@weco/common/icons/components/Eye';
import ClosedEye from '@weco/common/icons/components/A11yVisual';
import styled from 'styled-components';
import { TextInput } from './Registration.style';

const ShowPasswordButton = styled.button.attrs({ type: 'button' })`
  height: 55px;
  width: 55px;
  background: none;
  border: none;
`;

const Border = styled.div<{ invalid: boolean }>`
  display: flex;
  width: 100%;
  border: ${props => (props.invalid ? 'solid 2px #d1192c' : 'solid 1px #8f8f8f')};
  margin: 0.333em 0 1em;
`;
const Input = styled(TextInput)`
  height: 55px;
  padding: 0.7em;
  margin: 0;
  border: none;
  flex-grow: 2;
`;

export type PasswordInputProps = UseControllerOptions;

export const PasswordInput: React.FC<PasswordInputProps> = props => {
  const [isVisible, setIsVisible] = useState(false);
  const { field, meta } = useController(props);

  const toggleVisibility = () => setIsVisible(currentlyVisible => !currentlyVisible);

  return (
    <>
      <Border invalid={meta.invalid}>
        <Input id={props.name} type={isVisible ? 'text' : 'password'} {...field} />
        <ShowPasswordButton onClick={toggleVisibility} aria-label={isVisible ? 'Hide password' : 'Show password'}>
          {isVisible ? <ClosedEye /> : <OpenEye />}
        </ShowPasswordButton>
      </Border>
    </>
  );
};
