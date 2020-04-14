import { useState } from 'react';
import { storiesOf } from '@storybook/react';
import TextInput from '../../../common/views/components/TextInput/TextInput';
import Readme from '../../../common/views/components/TextInput/README.md';
import useValidation from '../../../common/hooks/useValidation';

const TextInputExample = () => {
  const [value, setValue] = useState('');

  return (
    <TextInput
      required={true}
      id={'test-id'}
      type={'email'}
      name={'email'}
      label={'Your email address'}
      errorMessage={'Enter a valid email address.'}
      value={value}
      handleChange={event => setValue(event.currentTarget.value)}
      {...useValidation()}
    />
  );
};

const stories = storiesOf('Components', module);
stories.add('TextInput', TextInputExample, { readme: { sidebar: Readme } });
