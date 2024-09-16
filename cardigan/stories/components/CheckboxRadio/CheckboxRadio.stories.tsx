import { useEffect, useState } from 'react';

import CheckboxRadio from '@weco/common/views/components/CheckboxRadio/CheckboxRadio';

const Template = args => {
  const [isSelected, setIsSelected] = useState(args.checked);

  useEffect(() => {
    setIsSelected(args.checked);
  }, [args.checked]);

  return (
    <CheckboxRadio
      {...args}
      id="checkboxRadio"
      ariaLabel="Cardigan checkbox/radio example"
      onChange={() => setIsSelected(!isSelected)}
      checked={isSelected}
    />
  );
};
export const basic = Template.bind({});
basic.args = {
  type: 'checkbox',
  text: 'Manuscripts',
  disabled: false,
  checked: false,
  hasErrorBorder: false,
};
basic.argTypes = {
  text: {
    control: 'text',
  },
  type: {
    options: ['checkbox', 'radio'],
    control: { type: 'radio' },
  },
  checked: { control: 'boolean' },
  hasErrorBorder: { control: 'boolean' },
  id: { table: { disable: true } },
  onChange: { table: { disable: true } },
  ariaLabel: { table: { disable: true } },
  form: { table: { disable: true } },
  value: { table: { disable: true } },
  name: { table: { disable: true } },
};
basic.storyName = 'CheckboxRadio';
