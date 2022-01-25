import { forwardRef, useContext, useState } from 'react';
// $FlowFixMe (tsx)
import { AppContext } from '@weco/common/views/components/AppContext/AppContext';
import {
  InputBaseComponentProps,
  InputProps,
  FilledInputProps,
  OutlinedInputProps,
} from '@mui/material';
import {
  TextInputWrap,
  TextInputLabel,
  TextInputInput,
  TextInputErrorMessage,
} from '@weco/common/views/components/TextInput/TextInput';
import styled from 'styled-components';

type Props = {
  id?: string;
  label: string;
  error: boolean;
  errorMessage?: string;
  inputProps: InputBaseComponentProps | undefined;
  InputProps:
    | Partial<InputProps>
    | Partial<FilledInputProps>
    | Partial<OutlinedInputProps>
    | undefined;
};

const CalendarInputWrap = styled.div`
  > div {
    align-items: center;
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
    const [placeholder, setPlaceholder] = useState('');

    return (
      <CalendarInputWrap>
        <TextInputWrap
          value={inputProps?.value}
          hasErrorBorder={error}
          big={false}
        >
          <TextInputLabel
            isEnhanced={isEnhanced}
            hasValue={!!inputProps?.value}
            htmlFor={id}
          >
            {label}
          </TextInputLabel>
          <TextInputInput
            id={id}
            ref={ref}
            type="tel"
            value={inputProps?.value}
            hasErrorBorder={error}
            {...inputProps}
            aria-invalid={error}
            aria-errormessage="calendarError"
            aria-describedby={'pick-up-date-description'}
            placeholder={placeholder}
            onFocus={() => setPlaceholder('dd/mm/yyyy')}
            onBlur={() => setPlaceholder('')}
            big={false}
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
