// @flow

import {font, spacing} from '../../../utils/classnames';

export type EventWithInputValue = {
  preventDefault: () => {},
  target: Array<{value: string}>
}

type Props = {|
  inputRef?: ?Function,
  id: string,
  type: string,
  defaultValue: string,
  label: string,
  fontStyles?: {},
  name?: string,
  placeholder?: string,
  disabled?: boolean,
  autofocus?: boolean,
  isLabelHidden?: boolean,
  required?: boolean,
  onChange?: (EventWithInputValue) => void
|}

const HTMLInput = ({
  required,
  inputRef,
  id,
  type,
  name,
  defaultValue,
  placeholder,
  disabled,
  autofocus,
  label,
  isLabelHidden,
  fontStyles = {s: 'HNL3', m: 'HNL2'},
  onChange
}: Props) => (
  <label className='input__label flex flex--v-center' htmlFor={id}>
    <input
      required={required}
      ref={inputRef}
      id={id}
      className={`input input--${type} ${font(fontStyles)} js-input`}
      type={type}
      name={name}
      defaultValue={defaultValue}
      placeholder={placeholder}
      disabled={disabled}
      autoFocus={autofocus && !defaultValue}
      onChange={onChange}/>

    {['radio', 'checkbox'].indexOf(type) > -1 &&
      <span className={`input__control-indicator input__control-indicator--${type}`}></span>
    }

    <span className={`input__label-wrap ${spacing({s: 1}, {margin: ['left']})} ${isLabelHidden ? 'input__label-wrap--hidden' : ''}`}>
      {label}
    </span>
  </label>
);

export default HTMLInput;
