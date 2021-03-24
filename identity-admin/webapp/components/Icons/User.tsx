import React from 'react';

export const User = (
  props: React.ComponentPropsWithoutRef<'svg'>
): JSX.Element => (
  <svg viewBox="0 0 24 24" {...props}>
    <title>User icon</title>
    <path
      className="icon__shape"
      fillRule="nonzero"
      d="M16.08 12.47a6 6 0 1 0-8 0c-3.57 1-4.62 3.4-4.9 6.23a3 3 0 0 0 3 3.31H18a3 3 0 0 0 3-3.31c-.28-2.83-1.34-5.26-4.92-6.23zM8.09 8a4 4 0 1 1 8 0 4 4 0 0 1-8 0zm10.68 11.67A1 1 0 0 1 18 20H6.18a1 1 0 0 1-1-1.11c.26-2.58 1-4.89 6.91-4.89s6.67 2.31 6.94 4.89a1 1 0 0 1-.26.78z"
    />
  </svg>
);
