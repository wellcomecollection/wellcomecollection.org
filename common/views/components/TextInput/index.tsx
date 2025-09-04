import {
  ChangeEvent,
  FocusEvent,
  forwardRef,
  ForwardRefRenderFunction,
  RefObject,
  useEffect,
  useState,
} from 'react';
import styled from 'styled-components';

import { useAppContext } from '@weco/common/contexts/AppContext';
import { exclamation, tickCircle } from '@weco/common/icons';
import { font } from '@weco/common/utils/classnames';
import Icon from '@weco/common/views/components/Icon';
import Space from '@weco/common/views/components/styled/Space';
import ClearInput from '@weco/common/views/components/TextInput/TextInput.Clear';

export const TextInputLabel = styled.label.attrs({
  className: font('intb', 5),
})`
  display: block;
  line-height: 1.2;
`;

type TextInputWrapProps = {
  $status?: 'error' | 'success';
  $isDisabled?: boolean;
  $isNewSearchBar?: boolean;
};
export const TextInputWrap = styled(Space).attrs({
  className: font('intr', 4),
  $v: { size: 's', properties: ['margin-top'] },
})<TextInputWrapProps>`
  display: flex;
  position: relative;
  border-width: ${props => (props.$isNewSearchBar ? '4px' : '1px')};
  border-style: solid;
  border-color: ${props =>
    props.$status
      ? props.$status === 'error'
        ? props.theme.color('validation.red')
        : props.theme.color('validation.green')
      : props.theme.color(
          props.$isNewSearchBar ? 'accent.green' : 'neutral.600'
        )};

  &:has(:focus-visible) {
    outline: 3px solid ${props => props.theme.color('yellow')};

    input {
      outline: none;
    }
  }

  &:focus-within {
    ${props =>
      !props.$isNewSearchBar &&
      `
      box-shadow: 0 0 0 6px ${props.theme.color('focus.yellow')};
      outline:  3px solid ${props.theme.color('black')};
    `}
    ${props =>
      props.$isNewSearchBar &&
      `
      border-color: ${props.theme.color('black')};
    `}
  }

  overflow: hidden;

  &:hover {
    border-color: ${props => props.theme.color('black')};
  }

  ${props =>
    props.$isDisabled
      ? `border-color:  ${props.theme.color('neutral.500')}`
      : ``}
`;

const HintCopy = styled.span.attrs({
  className: font('intr', 5),
})`
  display: block;
  color: ${props => props.theme.color('neutral.700')};
`;

export const TextInputInput = styled.input.attrs<{ $type?: string }>(props => ({
  type: props.$type || 'text',
}))`
  /* Should be 10px but this ensures it matches buttons' height as they have 2px border and inputs have 1px */
  padding: 11px 36px 11px 16px;
  appearance: none;
  border: 0;
  height: 100%;
  font-size: inherit;
  width: 100%;

  &::-ms-clear {
    display: none;
  }

  &:disabled {
    background-color: ${props => props.theme.color('neutral.300')};
  }
`;

const StatusMessage = styled(Space).attrs({
  className: font('intr', 6),
  $v: { size: 's', properties: ['margin-top'] },
})`
  display: flex;
  align-items: center;

  .icon {
    flex: 0 0 24px;
  }

  p {
    display: inline-block;
    ${props => props.theme.makeSpacePropertyValues('s', ['margin-left'])};
    margin-bottom: 0;
  }
`;

export const InputErrorMessage = ({
  id,
  errorMessage,
}: {
  id?: string;
  errorMessage: string;
}) => {
  return (
    <StatusMessage data-testid="TextInputErrorMessage" id={id} role="alert">
      <Icon icon={exclamation} iconColor="validation.red" />
      <p>{errorMessage}</p>
    </StatusMessage>
  );
};

type Props = {
  label: string;
  value: string;
  setValue: (value: string) => void;
  id: string;
  name?: string;
  type?: string;
  pattern?: string;
  required?: boolean;
  disabled?: boolean;
  placeholder?: string;
  hintCopy?: string;
  errorMessage?: string;
  successMessage?: string;
  isValid?: boolean;
  setIsValid?: (value: boolean) => void;
  showValidity?: boolean;
  setShowValidity?: (value: boolean) => void;
  autoFocus?: boolean;
  ariaLabel?: string;
  ariaDescribedBy?: string;
  form?: string;
  hasClearButton?: boolean;
  clearHandler?: () => void;
  isNewSearchBar?: boolean;
};

const Input: ForwardRefRenderFunction<HTMLInputElement, Props> = (
  {
    label,
    type,
    value,
    setValue,
    id,
    name,
    pattern,
    required,
    disabled,
    placeholder,
    hintCopy,
    errorMessage,
    successMessage,
    isValid,
    setIsValid,
    showValidity,
    setShowValidity,
    autoFocus,
    ariaLabel,
    ariaDescribedBy,
    form,
    hasClearButton,
    clearHandler,
    isNewSearchBar,
  }: Props,
  ref: RefObject<HTMLInputElement | null>
) => {
  const { isEnhanced } = useAppContext();

  function onChange(event: ChangeEvent<HTMLInputElement>) {
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

  function onBlur(event: FocusEvent<HTMLInputElement>) {
    setIsValid && setIsValid(event.currentTarget.validity.valid);
    setShowValidity && setShowValidity(!!value && true);
  }

  // Calculate text width for positioning clear button when isNewSearchBar is true
  const [textWidth, setTextWidth] = useState(0);

  useEffect(() => {
    if (isNewSearchBar && ref?.current && value) {
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      if (context) {
        const computedStyle = window.getComputedStyle(ref.current);
        context.font = `${computedStyle.fontSize} ${computedStyle.fontFamily}`;
        const metrics = context.measureText(value);
        setTextWidth(metrics.width);
      }
    } else {
      setTextWidth(0);
    }
  }, [value, isNewSearchBar, ref]);

  return (
    <div data-component="text-input">
      <TextInputLabel htmlFor={id}>{label}</TextInputLabel>

      {hintCopy && (
        <Space $v={{ size: 's', properties: ['margin-top'] }}>
          <HintCopy>{hintCopy}</HintCopy>
        </Space>
      )}

      <TextInputWrap
        $isNewSearchBar={isNewSearchBar}
        $isDisabled={disabled}
        $status={
          !isValid && showValidity
            ? 'error'
            : isValid && showValidity
              ? 'success'
              : undefined
        }
      >
        <TextInputInput
          ref={ref}
          id={id}
          name={name}
          required={required}
          disabled={disabled}
          value={value}
          pattern={pattern}
          onChange={onChange}
          onBlur={onBlur}
          placeholder={placeholder}
          autoFocus={autoFocus}
          $type={type}
          aria-label={ariaLabel}
          aria-describedby={ariaDescribedBy}
          aria-invalid={!!(!isValid && showValidity)}
          aria-errormessage={errorMessage && `${id}-errormessage`}
          form={form}
        />
        {isEnhanced && hasClearButton && value !== '' && (
          <ClearInput
            inputRef={ref}
            clickHandler={clearHandler}
            setValue={setValue}
            right={isNewSearchBar ? undefined : 10}
            left={isNewSearchBar ? 32 + textWidth : undefined}
          />
        )}
      </TextInputWrap>
      {successMessage && isValid && showValidity && (
        <StatusMessage data-testid="TextInputSuccessMessage">
          <Icon icon={tickCircle} iconColor="validation.green" />
          <p>{successMessage}</p>
        </StatusMessage>
      )}
      {errorMessage && !isValid && showValidity && (
        <InputErrorMessage
          id={`${id}-errormessage`}
          errorMessage={errorMessage}
        />
      )}
    </div>
  );
};

const TextInput = forwardRef<HTMLInputElement, Props>(Input);

export default TextInput;
