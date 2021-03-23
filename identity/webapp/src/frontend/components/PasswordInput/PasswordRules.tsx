import React from 'react';
import { RulesList } from './PasswordInput.style';

export const PasswordRules: React.FC = () => {
  return (
    <RulesList>
      <li className="font-hnl font-size-6">One lowercase character</li>
      <li className="font-hnl font-size-6">One uppercase character</li>
      <li className="font-hnl font-size-6">One number</li>
      <li className="font-hnl font-size-6">8 characters minimum</li>
    </RulesList>
  );
};
