import { ForwardedRef, FunctionComponent, PropsWithChildren } from 'react';
import ButtonSolid, { ButtonSolidProps } from './Buttons.Solid';
import ButtonSolidLink, { ButtonSolidLinkProps } from './Buttons.SolidLink';
import DropdownButton, { DropdownButtonProps } from './Buttons.Dropdown';
// import {
//   BorderlessLink,
//   BorderlessButton,
//   BorderlessLinkProps,
//   BorderlessButtonProps,
// } from './Buttons.Borderless';

type ButtonProps =
  // | (BorderlessButtonProps & {
  //     variant: 'BorderlessButton';
  //   })
  // | (BorderlessLinkProps & {
  //     variant: 'BorderlessLink';
  //   })
  | (PropsWithChildren<DropdownButtonProps> & {
      variant: 'DropdownButton';
    })
  | (ButtonSolidProps & {
      variant: 'ButtonSolid';
      ref?: ForwardedRef<HTMLButtonElement>;
    })
  | (ButtonSolidLinkProps & {
      variant: 'ButtonSolidLink';
    });

const Button: FunctionComponent<ButtonProps> = (props: ButtonProps) => {
  const { variant } = props;

  switch (variant) {
    // case 'BorderlessButton':
    //   return <BorderlessButton {...props} />;
    // case 'BorderlessLink':
    //   return <BorderlessLink {...props} />;
    case 'DropdownButton':
      return <DropdownButton {...props} />;
    case 'ButtonSolidLink':
      return <ButtonSolidLink {...props} />;
    case 'ButtonSolid':
    default:
      return <ButtonSolid {...props} />;
  }
};

export default Button;
export * from './Buttons.styles';
export * from './Buttons.types';
