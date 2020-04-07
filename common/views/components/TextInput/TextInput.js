// @flow
import { forwardRef, useContext, useState } from 'react';
import styled from 'styled-components';
import Icon from '../Icon/Icon';
import { AppContext } from '@weco/common/views/components/AppContext/AppContext';
// import Space, { type SpaceComponentProps } from '../styled/Space';
import { classNames } from '../../../utils/classnames';

const TextInputContainer = styled.div``;

const TextInputWrap = styled.div.attrs({
  className: classNames({
    'flex relative': true,
  }),
})`
  &:focus-within {
    label {
      font-size: 14px;
      transform: translateY(0%);
      top: 7px;
    }
  }
  overflow: hidden;
  border-radius: 6px;

  ${props =>
    props.hasErrorBorder &&
    `
    box-shadow: 0 0 0 1px ${props.theme.colors.red};
  `}
`;

const TextInputLabel = styled.label.attrs({
  className: classNames({
    absolute: true,
  }),
})`
  white-space: nowrap;
  top: 50%;
  left: 15px;
  transform: translateY(-50%);
  font-size: inherit;
  transition: top 125ms ease-in, font-size 125ms ease-in,
    transform 125ms ease-in;
  pointer-events: none;
  color: ${props => props.theme.colors.silver};

  ${props =>
    (!props.isEnhanced || props.hasValue) &&
    `
      top: 7px;
      transform: translateY(0);
      font-size: 14px;
  `}
`;

const TextInputInput = styled.input.attrs(props => ({
  type: props.type || 'text',
}))`
  padding: 25px 10px 10px 15px;
  appearance: none;
  border: 0;
  height: 100%;
  border: 1px solid ${props => props.theme.colors.pumice};
  border-radius: 6px;
  font-size: inherit;
  width: 100%;

  &:focus {
    outline: 0;
  }

  ${props =>
    !props.isValid &&
    props.shouldValidate &&
    `
  border-color: ${props.theme.colors.red};
  `}
`;

const TextInputCheckmark = styled.span.attrs({
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
  className: classNames({
    'font-hnm': true,
  }),
})`
  font-size: 14px;
  margin-top: 10px;
  padding-left: 15px;
  color: ${props => props.theme.colors.red};
`;

type Props = {
  label: string,
  pattern: ?string,
  required: ?boolean,
  type: ?string,
  placeholder: ?string,
  errorMessage: ?string,
  value: string,
  shouldValidate: boolean,
  handleInput: event => void,
  // We can also pass inputProps here
};

// $FlowFixMe (forwardRef)
const TextInput = forwardRef(
  (
    {
      label,
      type,
      value,
      pattern,
      required,
      errorMessage,
      shouldValidate,
      handleInput,
      ...inputProps
    }: Props,
    ref // eslint-disable-line
  ) => {
    const { isEnhanced } = useContext(AppContext);
    const [isValid, setIsValid] = useState(true);
    const [showValid, setShowValid] = useState(false);

    function onInput(event) {
      handleInput(event);
      const isValid = event.currentTarget.validity.valid;

      setShowValid(false);

      if (isValid) {
        setIsValid(isValid);
      }
    }

    function onBlur(event) {
      setIsValid(event.currentTarget.validity.valid);
      setShowValid(value && true);
    }

    return (
      <TextInputContainer>
        <TextInputWrap
          value={value}
          hasErrorBorder={shouldValidate && !isValid}
        >
          <TextInputLabel isEnhanced={isEnhanced} hasValue={!!value}>
            {label}
          </TextInputLabel>
          <TextInputInput
            ref={ref}
            required={required}
            value={value}
            pattern={pattern}
            onInput={onInput}
            onBlur={onBlur}
            isValid={isValid}
            shouldValidate={shouldValidate}
            type={type}
          />
          {isValid && showValid && shouldValidate && (
            <TextInputCheckmark>
              <Icon name={`check`} extraClasses={`icon--green`} />
            </TextInputCheckmark>
          )}
        </TextInputWrap>
        {errorMessage && !isValid && shouldValidate && (
          <TextInputErrorMessage>{errorMessage}</TextInputErrorMessage>
        )}
      </TextInputContainer>
    );
  }
);

TextInput.displayName = 'TextInput';

export default TextInput;
