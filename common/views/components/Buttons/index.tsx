import { ForwardedRef, FunctionComponent, PropsWithChildren } from 'react';
import ButtonSolid, { ButtonSolidProps } from './Buttons.Solid';
import ButtonSolidLink, { ButtonSolidLinkProps } from './Buttons.SolidLink';
import DropdownButton, { DropdownButtonProps } from './Buttons.Dropdown';

type ButtonProps =
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
