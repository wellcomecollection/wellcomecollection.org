import { useState } from 'react';
import TextInput from '@weco/common/views/components/TextInput/TextInput';
import useValidation from '@weco/common/hooks/useValidation';

const Template = () => {
  const [value, setValue] = useState('');

  return (
    <TextInput
      required={true}
      id="test-id"
      type="email"
      name="email"
      label="Your email address"
      errorMessage={'Enter a valid email address.'}
      value={value}
      setValue={setValue}
      {...useValidation()}
    />
  );
};
export const basic = Template.bind({});
basic.storyName = 'TextInput';
