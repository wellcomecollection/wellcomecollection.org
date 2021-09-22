import React from 'react';
import { RulesList } from './PasswordInput.style';

type Props = {
  isAtLeast8Characters: boolean;
  hasLowercaseLetters: boolean;
  hasUppercaseLetters: boolean;
  hasNumbers: boolean;
};

export const PasswordRules: React.FC<Props> = ({
  isAtLeast8Characters,
  hasLowercaseLetters,
  hasUppercaseLetters,
  hasNumbers,
}) => {
  console.log({
    isAtLeast8Characters,
    hasLowercaseLetters,
    hasUppercaseLetters,
    hasNumbers,
  });
  return (
    <RulesList>
      <li className="font-hnr font-size-6">At least 8 characters</li>
      <li className="font-hnr font-size-6">Lowercase letters (a-z)</li>
      <li className="font-hnr font-size-6">Uppercase letters (A-Z)</li>
      <li className="font-hnr font-size-6">Numbers (0-9)</li>
    </RulesList>
  );
};
