import React from 'react';
import { Button } from '../../../components/Button';
import { useResendActivationEmail } from '../../../hooks/useResendActivationEmail';

export function ResendActivationEmail(): JSX.Element {
  const { resendActivationEmail } = useResendActivationEmail();
  const handleClick = () => resendActivationEmail();
  return <Button onClick={handleClick}>Resend activation email</Button>;
}
