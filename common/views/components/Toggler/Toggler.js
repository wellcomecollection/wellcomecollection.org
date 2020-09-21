// @flow
import { useContext, useState } from 'react';
import TogglesContext from '../TogglesContext/TogglesContext';

type Props = {
  name: string,
  label: string,
};

const Toggler = ({ name, label }: Props) => {
  const toggles = useContext(TogglesContext);
  const [checked, setChecked] = useState(toggles[name]);
  return (
    <label>
      <input
        style={{ marginRight: '5px' }}
        type="checkbox"
        checked={checked}
        onChange={event => {
          const isChecked = event.currentTarget.checked;
          setChecked(isChecked);

          if (isChecked) {
            document.cookie = `toggle_${name}=${isChecked}; Max-Age=${31536000}`;
          }
          if (!isChecked) {
            document.cookie = `toggle_${name}=${isChecked}; Expires=${new Date(
              '1970-01-01'
            ).toString()}`;
          }
        }}
      />
      {label}
    </label>
  );
};

export default Toggler;
