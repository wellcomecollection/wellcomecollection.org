import { useState } from 'react';
import { storiesOf } from '@storybook/react';
import TextInput from '../../../common/views/components/TextInput/TextInput';
import Readme from '../../../common/views/components/TextInput/README.md';

const TextInputExample = () => {
  const [value, setValue] = useState('');
  const [isValid, setIsValid] = useState(true);
  const [showValidity, setShowValidity] = useState(false);

  return (
    <TextInput
      required={true}
      id={'test-id'}
      type={'email'}
      name={'email'}
      label={'Your email address'}
      errorMessage={'Enter a valid email address.'}
      value={value}
      handleInput={event => setValue(event.currentTarget.value)}
      isValid={isValid}
      setIsValid={setIsValid}
      showValidity={showValidity}
      setShowValidity={setShowValidity}
    />
  );
};

const stories = storiesOf('Components', module);
stories.add('TextInput', TextInputExample, { readme: { sidebar: Readme } });
