import { storiesOf } from '@storybook/react';
import { useState } from 'react';
import RadioGroup from '../../../common/views/components/RadioGroup/RadioGroup';
import Readme from '../../../common/views/components/RadioGroup/README.md';

const stories = storiesOf('Components', module);

const RadioGroupExample = () => {
  const [selected, setSelected] = useState(null);

  return (
    <RadioGroup
      name="example"
      selected={selected}
      onChange={setSelected}
      options={[
        {
          value: 'banana',
          label: 'Banana',
        },
        {
          value: 'apple',
          label: 'Apple',
        },
        {
          value: 'grapefruit',
          label: 'Grapefruit',
        },
        {
          value: 'strawberry',
          label: 'Strawberry',
        },
      ]}
    />
  );
};

stories.add('RadioGroup', RadioGroupExample, { readme: { sidebar: Readme } });
