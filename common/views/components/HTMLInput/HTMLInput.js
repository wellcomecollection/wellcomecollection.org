// @flow

import {font, spacing} from '../../../utils/classnames';

type Props = {|
  id: string,
  fontStyles: {},
  type: string,
  name: string,
  placeholder: string,
  value: string,
  disabled?: boolean,
  autofocus?: boolean,
  label: string,
  isLabelHidden?: boolean
|}

const HTMLInput = ({id, fontStyles = {s: 'HNL3', m: 'HNL2'}, type, name, value, placeholder, disabled, autofocus, label, isLabelHidden}: Props) => (
  <label className="input__label flex flex--v-center" htmlFor={id}>
    <input id={id}
      className={`input input--${type} ${font(fontStyles)} js-input`}
      type={type}
      name={name}
      value={value}
      placeholder={placeholder}
      disabled={disabled}
      autoFocus={autofocus && !value} />

    {['radio', 'checkbox'].indexOf(type) > -1 &&
      <span className={`input__control-indicator input__control-indicator--${type}`}></span>
    }

    <span className={`input__label-wrap ${spacing({s: 1}, {margin: ['left']})} ${isLabelHidden && 'input__label-wrap--hidden'}`}>
      {label}
    </span>
  </label>
);

export default HTMLInput;
