import React from 'react';
import { RulesList } from './PasswordInput.style';

export const PasswordRules: React.FC = () => {
  return (
    <RulesList>
      <li className="font-hnr font-size-6">At least 8 characters</li>
      <li className="font-hnr font-size-6">Lower case letters (a-z)</li>
      <li className="font-hnr font-size-6">Upper case letters (A-Z)</li>
      <li className="font-hnr font-size-6">Numbers (0-9)</li>
    </RulesList>
  );
};
