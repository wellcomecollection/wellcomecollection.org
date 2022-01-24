import { forwardRef, useContext, RefObject } from 'react';
import { InputBaseComponentProps } from '@mui/material';
// $FlowFixMe (tsx)
import { AppContext } from '../AppContext/AppContext';
import {
  TextInputWrap,
  TextInputLabel,
  TextInputInput,
  TextInputErrorMessage,
} from '../TextInput/TextInput';

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

const CalendarInput = forwardRef(
  (
    { id, label, error, errorMessage, inputProps, InputProps }: Props,
    ref: RefObject<HTMLInputElement>
  ) => {
    const { isEnhanced } = useContext(AppContext);
    return (
      <div>
        <TextInputWrap value={inputProps.value} hasErrorBorder={error}>
          <TextInputLabel
            isEnhanced={isEnhanced}
            hasValue={!!inputProps.value}
            htmlFor={id}
          >
            {label}
          </TextInputLabel>
          <TextInputInput
            id={id}
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
          <TextInputErrorMessage id="calendarError">
            {errorMessage}
          </TextInputErrorMessage>
        )}
      </div>
    );
  }
);

CalendarInput.displayName = 'CalendarInput';

export default CalendarInput;
