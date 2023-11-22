import {
  ForwardRefRenderFunction,
  ForwardedRef,
  PropsWithChildren,
  forwardRef,
} from 'react';
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
      return <ButtonSolid ref={ref} {...props} />;
  }
};

export default forwardRef<HTMLButtonElement, ButtonProps>(Button);
export * from './Buttons.styles';
export * from './Buttons.types';
