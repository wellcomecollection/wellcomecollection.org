import {
  ForwardedRef,
  forwardRef,
  ForwardRefRenderFunction,
  PropsWithChildren,
} from 'react';

import DropdownButton, { DropdownButtonProps } from './Buttons.Dropdown';
import ButtonSolid, { ButtonSolidProps } from './Buttons.Solid';
import ButtonSolidLink, { ButtonSolidLinkProps } from './Buttons.SolidLink';

export type ButtonProps =
  | (PropsWithChildren<DropdownButtonProps> & {
      variant: 'DropdownButton';
    })
  | (ButtonSolidProps & {
      variant: 'ButtonSolid';
    })
  | (ButtonSolidLinkProps & {
      variant: 'ButtonSolidLink';
    });

const Button: ForwardRefRenderFunction<HTMLButtonElement, ButtonProps> = (
  props: ButtonProps,
  ref?: ForwardedRef<HTMLButtonElement>
) => {
  const { variant } = props;

  switch (variant) {
    case 'DropdownButton':
      return <DropdownButton {...props} data-component="dropdown-button" />;
    case 'ButtonSolidLink':
      return <ButtonSolidLink {...props} data-component="button-solid-link" />;
    case 'ButtonSolid':
    default:
      return <ButtonSolid ref={ref} {...props} data-component="button-solid" />;
  }
};

export default forwardRef<HTMLButtonElement, ButtonProps>(Button);
export * from './Buttons.styles';
export * from './Buttons.types';
