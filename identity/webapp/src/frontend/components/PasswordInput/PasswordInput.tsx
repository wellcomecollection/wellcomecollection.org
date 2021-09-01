import React, { useState } from 'react';
import { useController, UseControllerOptions } from 'react-hook-form';
import { Border, Input, ShowPasswordButton } from './PasswordInput.style';
import { PasswordRules } from './PasswordRules';
import Icon from '@weco/common/views/components/Icon/Icon';
export type PasswordInputProps = UseControllerOptions & {
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
      <Border invalid={meta.invalid}>
        <Input
          id={props.id || props.name}
          type={isVisible ? 'text' : 'password'}
          {...field}
        />
        <ShowPasswordButton
          onClick={toggleVisibility}
          aria-label={isVisible ? 'Hide password' : 'Show password'}
        >
          <Icon name={isVisible ? 'a11yVisual' : 'eye'} />
        </ShowPasswordButton>
      </Border>
      {showPolicy && <PasswordRules />}
    </>
  );
};
