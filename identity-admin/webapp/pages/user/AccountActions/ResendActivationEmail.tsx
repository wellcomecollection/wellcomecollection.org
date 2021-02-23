import React from 'react';
import { useResendActivationEmail } from '../../../hooks/useResendActivationEmail';

export function ResendActivationEmail(): JSX.Element {
  const { resendActivationEmail } = useResendActivationEmail();
  const handleClick = () => resendActivationEmail();
  return <button onClick={handleClick}>Resend activation email</button>;
}
