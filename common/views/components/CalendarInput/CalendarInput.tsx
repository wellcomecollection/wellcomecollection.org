import { forwardRef, useContext } from 'react';
// $FlowFixMe (tsx)
import { AppContext } from '../AppContext/AppContext';
import {
  TextInputWrap,
  TextInputLabel,
  TextInputInput,
  TextInputErrorMessage,
} from '../TextInput/TextInput';
import styled from 'styled-components';

type Props = {
  id?: string;
  label: string;
  error: boolean;
  errorMessage?: string;
  inputProps: any; // TODO
  InputProps: any; // TODO
};

const CalendarInputWrap = styled.div`
  > div {
    align-items: center;
  }

  input {
    &::placeholder {
      transition: color ${props => props.theme.transitionProperties};
      color: ${props => props.theme.color('white')};
    }
  }

  &:focus-within {
    input::placeholder {
      color: ${props => props.theme.color('pewter')};
    }
  }

  .MuiInputAdornment-root {
    height: auto;
  }

  button {
    margin-right: 10px;
  }
`;

const CalendarErrorMessageWrap = styled.div`
  > span {
    padding: 0;
  }
`;

const CalendarInput = forwardRef<HTMLInputElement, Props>(
  ({ id, label, error, errorMessage, inputProps, InputProps }, ref) => {
    const { isEnhanced } = useContext(AppContext);

    return (
      <CalendarInputWrap>
        <TextInputWrap
          value={inputProps.value}
          hasErrorBorder={error}
          big={false}
        >
          <TextInputLabel
            isEnhanced={isEnhanced}
            hasValue={!!inputProps.value}
            htmlFor={id}
          >
            {label}
          </TextInputLabel>
          <TextInputInput
            id="test-id" // TODO
            ref={ref}
            type="tel"
            value={inputProps.value}
            hasErrorBorder={error}
            {...inputProps}
            aria-invalid={error}
            aria-errormessage="calendarError"
            aria-describedby={'pick-up-date-description'}
            autocomplete="off" // TODO
          />
          {InputProps?.endAdornment}
        </TextInputWrap>
        {errorMessage && error && (
          <CalendarErrorMessageWrap>
            <TextInputErrorMessage id="calendarError">
              {errorMessage}
            </TextInputErrorMessage>
          </CalendarErrorMessageWrap>
        )}
      </CalendarInputWrap>
    );
  }
);

CalendarInput.displayName = 'CalendarInput';

export default CalendarInput;
