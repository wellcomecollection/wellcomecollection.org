import React from 'react';
import { Button } from '../../../components/Button';
import { useResetPassword } from '../../../hooks/useResetPassword';

export function ResetPassword(): JSX.Element {
  const { resetPassword } = useResetPassword();
  const handleClick = () => resetPassword();
  return <Button onClick={handleClick}>Reset password</Button>;
}
