import React, { useState } from 'react';
import { useController, UseControllerOptions } from 'react-hook-form';
import { ShowPasswordButton } from './PasswordInput.style';
import {
  TextInputWrap,
  TextInputLabel,
  TextInputInput,
} from '@weco/common/views/components/TextInput/TextInput';
import Icon from '@weco/common/views/components/Icon/Icon';
import { a11YVisual, eye } from '@weco/common/icons';
export type PasswordInputProps = UseControllerOptions & {
  label: string;
  id?: string;
  showPolicy?: boolean;
};

export const PasswordInput: React.FC<PasswordInputProps> = props => {
  const [isVisible, setIsVisible] = useState(false);
  const { field, meta } = useController(props);
  const { showPolicy = false } = props;
  const toggleVisibility = () =>
    setIsVisible(currentlyVisible => !currentlyVisible);

  return (
    <>
      <TextInputWrap
        hasErrorBorder={meta.invalid}
        value={field.value}
        big={false}
      >
        <TextInputLabel isEnhanced={true} hasValue={!!field.value}>
          {props.label}
        </TextInputLabel>
        <TextInputInput
          big={false}
          hasErrorBorder={meta.invalid}
          id={props.id || props.name}
          type={isVisible ? 'text' : 'password'}
          {...field}
        />
        <ShowPasswordButton
          onClick={toggleVisibility}
          aria-label={isVisible ? 'Hide password' : 'Show password'}
        >
          <Icon icon={isVisible ? a11YVisual : eye} />
        </ShowPasswordButton>
      </TextInputWrap>
    </>
  );
};
