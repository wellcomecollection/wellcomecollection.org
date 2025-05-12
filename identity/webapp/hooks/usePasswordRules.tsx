import { useEffect, useState } from 'react';

type PasswordRules = {
  isAtLeast8Characters: boolean;
  hasLowercaseLetters: boolean;
  hasUppercaseLetters: boolean;
  hasNumbers: boolean;
};

const usePasswordRules = (input: string): PasswordRules => {
  const [isAtLeast8Characters, setIsAtLeast8Characters] = useState(false);
  const [hasLowercaseLetters, setHasLowercaseLetters] = useState(false);
  const [hasUppercaseLetters, setHasUppercaseLetters] = useState(false);
  const [hasNumbers, setHasNumbers] = useState(false);

  useEffect(() => {
    setIsAtLeast8Characters(Boolean(input.match(/.{8}/)));
    setHasLowercaseLetters(Boolean(input.match(/[a-z]/)));
    setHasUppercaseLetters(Boolean(input.match(/[A-Z]/)));
    setHasNumbers(Boolean(input.match(/[0-9]/)));
  }, [input]);

  return {
    isAtLeast8Characters,
    hasLowercaseLetters,
    hasUppercaseLetters,
    hasNumbers,
  };
};

export default usePasswordRules;
