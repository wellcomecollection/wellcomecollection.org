// @flow

import { font, spacing } from '../../../utils/classnames';

type Props = {|
  inputRef?: ?Function,
  id: string,
  type: string,
  value?: string,
  defaultValue?: string,
  label: string,
  fontStyles?: {},
  name?: string,
  placeholder?: string,
  disabled?: boolean,
  autofocus?: boolean,
  isLabelHidden?: boolean,
  required?: boolean,
  onChange?: (SyntheticEvent<HTMLInputElement>) => void,
|};

// `defaultValue` only gets set on initial load for a form.
// After that, it won't get 'naturally' updated because the
// intent was only to set an initial default value.
// We get around this by passing a `key`
// (the value itself) to the parent element.
const HTMLInput = ({
  required,
  inputRef,
  id,
  type,
  name,
  value,
  defaultValue,
  placeholder,
  disabled,
  autofocus,
  label,
  isLabelHidden,
  fontStyles = { s: 'HNL3', m: 'HNL2' },
  onChange,
}: Props) => (
  <label
    key={defaultValue}
    className="input__label flex flex--v-center"
    htmlFor={id}
  >
    <input
      required={required}
      ref={inputRef}
      id={id}
      className={`input input--${type} ${font(fontStyles)} js-input`}
      type={type}
      name={name}
      value={value}
      defaultValue={defaultValue}
      placeholder={placeholder}
      disabled={disabled}
      autoFocus={autofocus && !defaultValue}
      onChange={onChange}
    />

    {['radio', 'checkbox'].indexOf(type) > -1 && (
      <span
        className={`input__control-indicator input__control-indicator--${type}`}
      />
    )}

    <span
      className={`input__label-wrap line-height-1 ${spacing(
        { s: 2 },
        { margin: ['left'] }
      )} ${isLabelHidden ? 'input__label-wrap--hidden' : ''}`}
      dangerouslySetInnerHTML={{ __html: label }}
    />
  </label>
);

export default HTMLInput;
