import React, { useState } from 'react';
import { useController, UseControllerOptions } from 'react-hook-form';
import OpenEye from '@weco/common/icons/components/Eye';
import ClosedEye from '@weco/common/icons/components/A11yVisual';
import { Border, Input, RulesList, ShowPasswordButton } from './PasswordInput.style';

export type PasswordInputProps = UseControllerOptions & {
  id?: string;
  showPolicy?: boolean;
};

export const PasswordInput: React.FC<PasswordInputProps> = props => {
  const [isVisible, setIsVisible] = useState(false);
  const { field, meta } = useController(props);
  const { showPolicy = false } = props;

  const toggleVisibility = () => setIsVisible(currentlyVisible => !currentlyVisible);

  return (
    <>
      <Border invalid={meta.invalid}>
        <Input id={props.id || props.name} type={isVisible ? 'text' : 'password'} {...field} />
        <ShowPasswordButton onClick={toggleVisibility} aria-label={isVisible ? 'Hide password' : 'Show password'}>
          {isVisible ? <ClosedEye /> : <OpenEye />}
        </ShowPasswordButton>
      </Border>
      {showPolicy && (
        <RulesList>
          <li className="font-hnl font-size-6">One lowercase character</li>
          <li className="font-hnl font-size-6">One uppercase character</li>
          <li className="font-hnl font-size-6">One number</li>
          <li className="font-hnl font-size-6">8 characters minimum</li>
        </RulesList>
      )}
    </>
  );
};
