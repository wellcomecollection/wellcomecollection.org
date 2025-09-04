import {
  ForwardedRef,
  forwardRef,
  ForwardRefRenderFunction,
  SyntheticEvent,
} from 'react';

import { classNames } from '@weco/common/utils/classnames';
import { dataGtmPropsToAttributes } from '@weco/common/utils/gtm';
import Icon from '@weco/common/views/components/Icon';

import {
  BaseButtonInner,
  ButtonIconWrapper,
  StyledButton,
} from './Buttons.styles';
import { ButtonSolidBaseProps } from './Buttons.types';

export type ButtonSolidProps = ButtonSolidBaseProps & {
  disabled?: boolean;
  clickHandler?: (event: SyntheticEvent<HTMLButtonElement>) => void;
  isPill?: boolean;
  isNewSearchBar?: boolean;
};

const Button: ForwardRefRenderFunction<HTMLButtonElement, ButtonSolidProps> = (
  {
    icon,
    text,
    type,
    isTextHidden,
    clickHandler,
    ariaControls,
    ariaExpanded,
    dataGtmProps,
    dataTestId,
    ariaLive,
    disabled,
    size,
    colors,
    isIconAfter,
    form,
    isPill,
    isNewSearchBar,
  }: ButtonSolidProps,
  ref: ForwardedRef<HTMLButtonElement>
) => {
  function handleClick(event: SyntheticEvent<HTMLButtonElement>) {
    clickHandler && clickHandler(event);
  }

  return (
    <StyledButton
      {...dataGtmPropsToAttributes(dataGtmProps)}
      ref={ref}
      type={type}
      aria-controls={ariaControls}
      aria-expanded={ariaExpanded}
      aria-live={ariaLive}
      data-testid={dataTestId}
      onClick={handleClick}
      disabled={disabled}
      form={form}
      $size={size}
      $colors={colors}
      $isPill={isPill}
      $hasIcon={!!icon}
      $isIconAfter={isIconAfter}
    >
      <BaseButtonInner
        $isNewSearchBar={isNewSearchBar}
        $isInline={size === 'small'}
        $isPill={isPill}
      >
        {isIconAfter && (
          <span
            className={classNames({
              'visually-hidden': !!isTextHidden,
            })}
          >
            {text}
          </span>
        )}
        {icon && (
          <ButtonIconWrapper
            $iconAfter={isIconAfter}
            $isTextHidden={isTextHidden}
          >
            <Icon icon={icon} />
          </ButtonIconWrapper>
        )}
        {!isIconAfter && (
          <span
            className={classNames({
              'visually-hidden': !!isTextHidden,
            })}
          >
            {text}
          </span>
        )}
      </BaseButtonInner>
    </StyledButton>
  );
};

const ButtonSolid = forwardRef<HTMLButtonElement, ButtonSolidProps>(Button);

export default ButtonSolid;
