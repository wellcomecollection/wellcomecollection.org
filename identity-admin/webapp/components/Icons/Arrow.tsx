import React from 'react';

export const Arrow = (
  props: React.ComponentPropsWithoutRef<'svg'>
): JSX.Element => (
  <svg viewBox="0 0 24 24" {...props}>
    <path
      className="icon__shape"
      fillRule="nonzero"
      d="M21.7 11.6l-7.5-7.5c-.4-.4-1-.4-1.4 0-.4.4-.4 1 0 1.4l5.8 5.8H2.9c-.6 0-1 .4-1 1s.4 1 1 1h15.7l-5.8 5.8c-.4.4-.4 1 0 1.4.2.2.5.3.7.3.2 0 .5-.1.7-.3l7.5-7.5c.4-.4.4-1 0-1.4z"
    />
  </svg>
);
