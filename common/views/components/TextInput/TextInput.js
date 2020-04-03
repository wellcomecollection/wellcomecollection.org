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
`;

const TextInputLabel = styled.label.attrs({
  className: classNames({
    absolute: true,
  }),
})`
  top: 50%;
  left: 15px;
  transform: translateY(-50%);
  font-size: 16px;
  transition: top 125ms ease-in, font-size 125ms ease-in,
    transform 125ms ease-in;
  pointer-events: none;
  color: ${props => props.theme.colors.pumice};

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
    `
  border-color: ${props.theme.colors.red};
  box-shadow: 0 0 0 1px ${props.theme.colors.red};
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
`;

const TextInputErrorMessage = styled.span`
  font-size: 14px;
  font-weight: bold;
  margin-top: 10px;
  padding-left: 15px;
  color: ${props => props.theme.colors.red};
`;

type Props = {
  label: string,
  type: ?string,
  errorMessage: ?string,
  // We can also pass inputProps here
};

// $FlowFixMe (forwardRef)
const TextInput = forwardRef(
  (
    { label, type, errorMessage, ...inputProps }: Props,
    ref // eslint-disable-line
  ) => {
    const { isEnhanced } = useContext(AppContext);
    const [value, setValue] = useState('');
    const [isValid, setIsValid] = useState(true);
    const [showValid, setShowValid] = useState(false);

    function handleInput(event) {
      const isValid = event.currentTarget.validity.valid;

      setShowValid(false);
      setValue(event.currentTarget.value);

      if (isValid) {
        setIsValid(isValid);
      }
    }

    function handleBlur(event) {
      setIsValid(event.currentTarget.validity.valid);
      setShowValid(value && true);
    }

    return (
      <TextInputContainer>
        <TextInputWrap value={value}>
          <TextInputLabel isEnhanced={isEnhanced} hasValue={!!value}>
            {label}
          </TextInputLabel>
          <TextInputInput
            onInput={handleInput}
            onBlur={handleBlur}
            isValid={isValid}
            type={type}
          />
          {isValid && showValid && (
            <TextInputCheckmark>
              <Icon name={`check`} extraClasses={`icon--green`} />
            </TextInputCheckmark>
          )}
        </TextInputWrap>
        {errorMessage && !isValid && (
          <TextInputErrorMessage>{errorMessage}</TextInputErrorMessage>
        )}
      </TextInputContainer>
    );
  }
);

TextInput.displayName = 'TextInput';

export default TextInput;
