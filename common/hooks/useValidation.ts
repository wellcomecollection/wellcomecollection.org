import { Dispatch, SetStateAction, useState } from 'react';

type Validation = {
  isValid: boolean;
  setIsValid: Dispatch<SetStateAction<boolean>>;
  showValidity: boolean;
  setShowValidity: Dispatch<SetStateAction<boolean>>;
};

const useValidation = (
  initIsValid = false,
  initShowValidity = false
): Validation => {
  const [isValid, setIsValid] = useState(initIsValid);
  const [showValidity, setShowValidity] = useState(initShowValidity);

  return { isValid, setIsValid, showValidity, setShowValidity };
};

export default useValidation;
