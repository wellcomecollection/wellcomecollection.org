import {
  forwardRef,
  RefObject,
  ForwardRefRenderFunction,
  ChangeEvent,
  FocusEvent,
} from 'react';
import styled from 'styled-components';
import Icon from '@weco/common/views/components/Icon/Icon';
import { exclamation, tickCircle } from '@weco/common/icons';
import { font } from '@weco/common/utils/classnames';
import Space from '../styled/Space';

type TextInputWrapProps = {
  $status?: 'error' | 'success';
  $big?: boolean;
  $isDisabled?: boolean;
};
export const TextInputWrap = styled(Space).attrs<TextInputWrapProps>(props => ({
  className: props.$big ? font('intr', 4) : font('intr', 5),
  $v: { size: 's', properties: ['margin-top'] },
}))<TextInputWrapProps>`
  display: flex;
  position: relative;
  border-width: 1px;
  border-style: solid;
  border-color: ${props =>
    props.$status
      ? props.$status === 'error'
        ? props.theme.color('validation.red')
        : props.theme.color('validation.green')
      : props.theme.color('neutral.600')};

  &:focus-within {
    box-shadow: 0 0 0 6px ${props => props.theme.color('focus.yellow')};
    outline: 3px solid ${props => props.theme.color('black')};
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
  padding: 10px 36px 10px 16px;
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

  p {
    display: inline-block;
    ${props => props.theme.makeSpacePropertyValues('s', ['margin-left'])};
    margin-bottom: 0;
  }
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
  big?: boolean;
  ariaLabel?: string;
  ariaDescribedBy?: string;
  form?: string;
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
    big,
  }: Props,
  ref: RefObject<HTMLInputElement>
) => {
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

  return (
    <div>
      <label
        htmlFor={id}
        className={font('intb', 5)}
        style={{ display: 'block', lineHeight: 1.2 }}
      >
        {label}
      </label>

      {hintCopy && (
        <Space $v={{ size: 's', properties: ['margin-top'] }}>
          <HintCopy>{hintCopy}</HintCopy>
        </Space>
      )}

      <TextInputWrap
        $big={!!big}
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
      </TextInputWrap>
      {successMessage && isValid && showValidity && (
        <StatusMessage>
          <Icon
            data-testid="TextInputCheckmark"
            icon={tickCircle}
            iconColor="validation.green"
          />
          <p>{successMessage}</p>
        </StatusMessage>
      )}
      {errorMessage && !isValid && showValidity && (
        <StatusMessage id={`${id}-errormessage`} role="alert">
          <Icon
            data-testid="TextInputErrorMessage"
            icon={exclamation}
            iconColor="validation.red"
          />
          <p>{errorMessage}</p>
        </StatusMessage>
      )}
    </div>
  );
};

const TextInput2 = forwardRef<HTMLInputElement, Props>(Input);

export default TextInput2;
