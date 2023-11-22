import { ForwardedRef, FunctionComponent } from 'react';
import ButtonSolid, { ButtonSolidProps } from './Buttons.ButtonSolid';
import ButtonSolidLink, {
  ButtonSolidLinkProps,
} from './Buttons.ButtonSolidLink';

type ButtonProps =
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
