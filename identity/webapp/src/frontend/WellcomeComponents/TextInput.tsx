// Converted from flow to TSX element
import React, { forwardRef, useContext, ReactElement } from 'react';
import styled from 'styled-components';
import Icon from '@weco/common/views/components/Icon/Icon';
import { AppContext } from '@weco/common/views/components/AppContext/AppContext';
import { classNames } from '@weco/common/utils/classnames';

type TextInputWrapProps = {
  value: any;
  hasErrorBorder: boolean | undefined;
  big: boolean | undefined;
};

const TextInputWrap = styled.div.attrs<TextInputWrapProps>(() => ({
  className: classNames({'flex relative': true,})})
)<TextInputWrapProps>`
  font-size: ${(props: any) => (props.big ? '20px' : '16px')};

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
    box-shadow: 0 0 0 1px ${props.theme.color('red')};
  `}
`;

type TextInputLabelProps = {
  isEnhanced: boolean | undefined;
  hasValue: boolean| undefined;
  htmlFor: string;
};


const TextInputLabel = styled.label.attrs<TextInputLabelProps>(() => ({
    className: classNames({
    absolute: true,
  }),
}))<TextInputLabelProps>`
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
  color: ${props => props.theme.color('silver')};

  ${(props: any) =>
    (!props.$isEnhanced || props.hasValue) &&
    `
    @supports (display: block) {
      top: 4px;
      transform: translateY(0);
      font-size: 14px;
    }
  `}
`;


type TextInputInputProps = {
  hasErrorBorder: boolean | undefined;
};


const TextInputInput = styled.input.attrs<TextInputInputProps>(props => ({
  type: props.type || 'text',
}))<TextInputInputProps>`
  padding: 27px 40px 8px 15px;
  appearance: none;
  border: 0;
  height: 100%;
  border: 1px solid ${props => props.theme.color('pumice')};
  border-radius: 6px;
  font-size: inherit;
  width: 100%;

  &:focus {
    outline: 0;
    border-color: ${props => props.theme.color('turquoise')};
  }

  &:-ms-clear {
    display: none;
  }

  ${(props: any) =>
    props.hasErrorBorder &&
    `
      &,
      &:focus {
        border-color: ${props.theme.color('red')};
      }
    `}
`;

const TextInputCheckmark = styled.span.attrs({
  'data-test-id': 'TextInputCheckmark',
  className: classNames({
    absolute: true,
  }),
})`
  top: 50%;
  transform: translateY(-50%);
  right: 10px;
  line-height: 0;
`;

const TextInputErrorMessage = styled.span.attrs({
  'data-test-id': 'TextInputErrorMessage',
  className: classNames({
    'font-hnm': true,
  }),
})`
  font-size: 14px;
  margin-top: 10px;
  padding-left: 15px;
  color: ${props => props.theme.color('red')};
`;

type Props = {
  label: string,
  value: string | undefined,
  setValue: (value: string) => void,
  id: string,
  name?: string,
  type?: string,
  pattern?: string,
  required?: boolean,
  placeholder?: string,
  errorMessage?: string | ReactElement,
  isValid?: boolean,
  setIsValid?: (value: boolean) => void,
  showValidity?: boolean,
  setShowValidity?: (value: boolean) => void,
  autoFocus?: boolean,
  big?: boolean,
  ariaLabel?: string,
};

const TextInput = forwardRef(
  (
    {
      label,
      type,
      value,
      setValue,
      id,
      name,
      pattern,
      required,
      errorMessage,
      isValid,
      setIsValid,
      showValidity,
      setShowValidity,
      autoFocus,
      big,
      ariaLabel,
    }: Props,
    ref
  ) => {
    const { isEnhanced } = useContext(AppContext);

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
    }

    return (
      <div>
        <TextInputWrap value={value} hasErrorBorder={!isValid && showValidity} big={big}>
          <TextInputLabel isEnhanced={isEnhanced} hasValue={!!value} htmlFor={id}>
            {label}
          </TextInputLabel>
          <TextInputInput
            id={id}
            name={name}
            required={required}
            value={value}
            pattern={pattern}
            onChange={onChange}
            onBlur={onBlur}
            hasErrorBorder={!isValid && showValidity}
            type={type}
            autoFocus={autoFocus}
            aria-label={ariaLabel}
          />
          {isValid && showValidity && (
            <TextInputCheckmark>
              <Icon name={`check`} extraClasses={`icon--green`} />
            </TextInputCheckmark>
          )}
        </TextInputWrap>
        {errorMessage && !isValid && showValidity && (
          <TextInputErrorMessage>{errorMessage}</TextInputErrorMessage>
        )}
      </div>
    );
  }
);

TextInput.displayName = 'TextInput';

export default TextInput;
