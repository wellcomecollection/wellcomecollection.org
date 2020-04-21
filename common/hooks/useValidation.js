import { useState } from 'react';

const useValidation = (initIsValid = false, initShowValidity = false) => {
  const [isValid, setIsValid] = useState(initIsValid);
  const [showValidity, setShowValidity] = useState(initShowValidity);

  return { isValid, setIsValid, showValidity, setShowValidity };
};

export default useValidation;
