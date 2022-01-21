import { forwardRef, useContext } from 'react';
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
  inputProps: any; // TODO
  InputProps: any; // TODO
};

const CalendarInput = forwardRef(
  (
    { id, label, error, errorMessage, inputProps, InputProps }: Props,
    ref: any
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
