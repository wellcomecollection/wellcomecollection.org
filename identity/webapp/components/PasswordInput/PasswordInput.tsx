import { FunctionComponent, useEffect, useState } from 'react';
import { useController, UseControllerProps } from 'react-hook-form';
import styled from 'styled-components';

import { a11YVisual, eye } from '@weco/common/icons';
import Icon from '@weco/common/views/components/Icon';
import {
  TextInputInput,
  TextInputLabel,
  TextInputWrap,
} from '@weco/common/views/components/TextInput';

import { ShowPasswordButton } from './PasswordInput.styles';

const TextInputPassword = styled(TextInputInput)`
  padding-right: 0;

  &:focus-visible {
    box-shadow: none;
  }
`;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type PasswordInputProps = UseControllerProps<any> & {
  label: string;
  id?: string;
  updateInput?: (value: string) => void;
};

export const PasswordInput: FunctionComponent<PasswordInputProps> = props => {
  const { updateInput } = props;
  const [isVisible, setIsVisible] = useState(false);
  const { field, fieldState } = useController(props);
  const toggleVisibility = () =>
    setIsVisible(currentlyVisible => !currentlyVisible);

  useEffect(() => {
    if (!updateInput) return;

    updateInput(field.value);
  }, [field.value, updateInput]);

  return (
    <>
      <TextInputLabel htmlFor={props.id}>{props.label}</TextInputLabel>
      <TextInputWrap $status={fieldState.invalid ? 'error' : undefined}>
        <TextInputPassword
          id={props.id || props.name}
          $type={isVisible ? 'text' : 'password'}
          {...field}
        />
        <ShowPasswordButton
          onClick={toggleVisibility}
          aria-label={isVisible ? 'Hide password' : 'Show password'}
        >
          <Icon icon={isVisible ? a11YVisual : eye} iconColor="neutral.500" />
        </ShowPasswordButton>
      </TextInputWrap>
    </>
  );
};
