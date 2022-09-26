import { forwardRef, useContext, useState, RefObject, FC } from 'react';
import styled from 'styled-components';
import Icon from '../Icon/Icon';
import { AppContext } from '../AppContext/AppContext';
import { check } from '@weco/common/icons';

type TextInputWrapProps = {
  value: string;
  big: boolean;
  hasErrorBorder: boolean;
};
export const TextInputWrap = styled.div<TextInputWrapProps>`
  display: flex;
  position: relative;
  border: 1px solid ${props => props.theme.color('pumice')};
  border-radius: 6px;
  font-size: ${props => (props.big ? '20px' : '16px')};

  &:focus-within {
    box-shadow: ${props => props.theme.focusBoxShadow};

    label {
      font-size: 14px;
      transform: translateY(0%);
      top: 4px;
    }
  }
  overflow: hidden;
  border-radius: 6px;

  ${props =>
    props.hasErrorBorder &&
    `
    box-shadow: 0 0 0 1px ${props.theme.newColor('validation.red')};
  `}
`;

type TextInputLabelProps = {
  isEnhanced: boolean;
  hasValue: boolean;
};
export const TextInputLabel = styled.label<TextInputLabelProps>`
  position: absolute;

  /* Styles for browsers that don't support :focus-within (<=IE11) */
  font-size: 14px;
  transform: translateY(0%);
  top: 4px;

  /* IE doesn't support :focus-within, but you can't test for :focus-within
  using @supports. Fortunately, IE doesn't support @supports, so this only
  targets browsers that support @suports (> IE11) */
  @supports (display: block) {
    font-size: inherit;
    transform: translateY(-50%);
    top: 50%;
  }

  white-space: nowrap;
  left: 15px;
  transition: top 125ms ease-in, font-size 125ms ease-in,
    transform 125ms ease-in;
  pointer-events: none;
  color: ${props => props.theme.color('pewter')};

  ${props =>
    (!props.isEnhanced || props.hasValue) &&
    `
    @supports (display: block) {
      top: 4px;
      transform: translateY(0);
      font-size: 14px;
    }
  `}
`;

type TextInputInputProps = {
  hasErrorBorder: boolean;
  big: boolean;
};
export const TextInputInput = styled.input.attrs(props => ({
  type: props.type || 'text',
}))<TextInputInputProps>`
  padding: ${props =>
    props.big ? '27px 130px 8px 15px' : '27px 40px 8px 15px'};
  appearance: none;
  border: 0;
  height: 100%;
  font-size: inherit;
  width: 100%;

  &:focus {
    outline: 0;
    border-color: ${props => props.theme.newColor('accent.turquoise')};
  }

  &:-ms-clear {
    display: none;
  }

  ${props =>
    props.hasErrorBorder &&
    `
      &,
      &:focus {
        border-color: ${props.theme.newColor('validation.red')};
      }
    `}
`;

const TextInputCheckmark = styled.span.attrs({
  'data-test-id': 'TextInputCheckmark',
})`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  right: 10px;
  line-height: 0;
`;

export const TextInputErrorMessage = styled.span.attrs({
  role: 'alert',
  'data-test-id': 'TextInputErrorMessage',
  className: 'font-intb',
})`
  display: block;
  font-size: 14px;
  margin-top: 10px;
  padding-left: 15px;
  color: ${props => props.theme.newColor('validation.red')};
`;

type Props = {
  label: string;
  value: string;
  setValue: (value: string) => void;
  id: string;
  name?: string;
  type?: string;
  pattern?: string;
  required?: boolean;
  placeholder?: string;
  errorMessage?: string;
  isValid?: boolean;
  setIsValid?: (value: boolean) => void;
  showValidity?: boolean;
  setShowValidity?: (value: boolean) => void;
  autoFocus?: boolean;
  big?: boolean;
  ariaLabel?: string;
  ariaDescribedBy?: string;
};

const Input: FC<Props> = (
  {
    label,
    type,
    value,
    setValue,
    id,
    name,
    pattern,
    required,
    placeholder,
    errorMessage,
    isValid,
    setIsValid,
    showValidity,
    setShowValidity,
    autoFocus,
    big,
    ariaLabel,
    ariaDescribedBy,
  }: Props,
  ref: RefObject<HTMLInputElement>
) => {
  const { isEnhanced } = useContext(AppContext);
  const [displayedPlaceholder, setDisplayedPlaceholder] = useState('');

  function onChange(event) {
    const isValueValid = event.currentTarget.validity.valid;

    setValue(event.currentTarget.value);

    if (isValid && setShowValidity) {
      setShowValidity(false);
    }

    setIsValid && setIsValid(isValueValid);

    if (isValueValid && setShowValidity) {
      setShowValidity(false);
    }
  }

  function onBlur(event) {
    setIsValid && setIsValid(event.currentTarget.validity.valid);
    setShowValidity && setShowValidity(!!value && true);
    setDisplayedPlaceholder('');
  }

  return (
    <div>
      <TextInputWrap
        value={value}
        hasErrorBorder={!!(!isValid && showValidity)}
        big={!!big}
      >
        <TextInputLabel isEnhanced={isEnhanced} hasValue={!!value} htmlFor={id}>
          {label}
        </TextInputLabel>
        <TextInputInput
          ref={ref}
          id={id}
          name={name}
          required={required}
          value={value}
          pattern={pattern}
          onChange={onChange}
          onBlur={onBlur}
          hasErrorBorder={!!(!isValid && showValidity)}
          type={type}
          placeholder={displayedPlaceholder}
          onFocus={() => {
            if (placeholder) {
              setDisplayedPlaceholder(placeholder);
            }
          }}
          autoFocus={autoFocus}
          aria-label={ariaLabel}
          aria-describedby={ariaDescribedBy}
          aria-invalid={!!(!isValid && showValidity)}
          aria-errormessage={errorMessage && `${id}-errormessage`}
          big={!!big}
        />
        {isValid && showValidity && (
          <TextInputCheckmark>
            <Icon icon={check} color="validation.green" />
          </TextInputCheckmark>
        )}
      </TextInputWrap>
      {errorMessage && !isValid && showValidity && (
        <TextInputErrorMessage id={`${id}-errormessage`} role="alert">
          {errorMessage}
        </TextInputErrorMessage>
      )}
    </div>
  );
};

const TextInput = forwardRef(Input);

export default TextInput;
