import { useState } from 'react';
import TextInput from '@weco/common/views/components/TextInput/TextInput';
import useValidation from '@weco/common/hooks/useValidation';
import Readme from '@weco/common/views/components/TextInput/README.md';
import { ReadmeDecorator } from '@weco/cardigan/config/decorators';

const Template = () => {
  const [value, setValue] = useState('');
  return (
    <ReadmeDecorator
      WrappedComponent={TextInput}
      args={{
        required: true,
        id: 'test-id',
        type: 'email',
        name: 'email',
        label: 'Your email address',
        errorMessage: 'Enter a valid email address.',
        value,
        setValue,
        ...useValidation(),
      }}
      Readme={Readme}
    />
  );
};
export const basic = Template.bind({});
basic.storyName = 'TextInput';
