import { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';

import { ReadmeDecorator } from '@weco/cardigan/config/decorators';
import useValidation from '@weco/common/hooks/useValidation';
import TextInput from '@weco/common/views/components/TextInput';
import Readme from '@weco/common/views/components/TextInput/README.mdx';

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
        errorMessage:
          'Enter an email address in the correct format, like name@example.com',
        successMessage: "Great email address you've got there",
        value,
        setValue,
        ...useValidation(),
      }}
      Readme={Readme}
    />
  );
};

const meta: Meta<typeof TextInput> = {
  title: 'Components/TextInput',
  component: TextInput,
};

export default meta;

type Story = StoryObj<typeof TextInput>;

export const Basic: Story = {
  name: 'TextInput',
  render: Template,
};
