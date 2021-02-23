import React from 'react';
import { useResetPassword } from '../../../hooks/useResetPassword';

export function ResetPassword(): JSX.Element {
  const { resetPassword } = useResetPassword();
  const handleClick = () => resetPassword();
  return <button onClick={handleClick}>Reset password</button>;
}
