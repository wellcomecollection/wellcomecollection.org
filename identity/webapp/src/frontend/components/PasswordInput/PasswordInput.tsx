import React, { useEffect, useState } from 'react';
import { useController, UseControllerProps } from 'react-hook-form';
import { ShowPasswordButton } from './PasswordInput.style';
import {
  TextInputWrap,
  TextInputLabel,
  TextInputInput,
} from '@weco/common/views/components/TextInput/TextInput';
import Icon from '@weco/common/views/components/Icon/Icon';
import { a11YVisual, eye } from '@weco/common/icons';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type PasswordInputProps = UseControllerProps<any> & {
  label: string;
  id?: string;
  updateInput?: (value: string) => void;
};

export const PasswordInput: React.FunctionComponent<
  PasswordInputProps
> = props => {
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
      <TextInputWrap $hasErrorBorder={fieldState.invalid}>
        <TextInputLabel
          htmlFor={props.id}
          $isEnhanced={true}
          $hasValue={!!field.value}
        >
          {props.label}
        </TextInputLabel>
        <TextInputInput
          id={props.id || props.name}
          {...field}
          $hasErrorBorder={fieldState.invalid}
          $type={isVisible ? 'text' : 'password'}
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
