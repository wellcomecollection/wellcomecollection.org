import { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';

import { ReadmeDecorator } from '@weco/cardigan/config/decorators';
import useValidation from '@weco/common/hooks/useValidation';
import TextInput from '@weco/common/views/components/TextInput';
import Readme from '@weco/common/views/components/TextInput/README.mdx';

const meta: Meta<typeof TextInput> = {
  title: 'Components/Inputs/TextInput',
  component: TextInput,
  args: {
    required: true,
    id: 'test-id',
    type: 'email',
    name: 'email',
    label: 'Your email address',
    errorMessage:
      'Enter an email address in the correct format, like name@example.com',
    successMessage: "Great email address you've got there",
    disabled: false,
    placeholder: '',
    hintCopy: '',
    isValid: undefined,
    hasClearButton: false,
  },
  argTypes: {
    id: { table: { disable: true } },
    name: { table: { disable: true } },
    pattern: { table: { disable: true } },
    isValid: { table: { disable: true } },
    setIsValid: { table: { disable: true } },
    showValidity: { table: { disable: true } },
    setShowValidity: { table: { disable: true } },
    ariaLabel: { table: { disable: true } },
    ariaDescribedBy: { table: { disable: true } },
    clearHandler: { table: { disable: true } },
    autoFocus: { table: { disable: true } },
    isNewSearchBar: { table: { disable: true } },
    form: { table: { disable: true } },
    required: { table: { disable: true } },
    hasClearButton: { control: 'boolean', name: 'Has clear button' },
    disabled: { control: 'boolean', name: 'Disabled' },
    placeholder: { control: 'text', name: 'Placeholder' },
    hintCopy: { control: 'text', name: 'Hint copy' },
    type: {
      options: ['text', 'password'],
      control: { type: 'radio' },
      name: 'Type examples',
    },
    label: { control: 'text', name: 'Label' },
    errorMessage: { control: 'text', name: 'Error message' },
    successMessage: { control: 'text', name: 'Success message' },
    value: { table: { disable: true } },
    setValue: { table: { disable: true } },
  },
};

const Template = args => {
  const [value, setValue] = useState('');

  return (
    <ReadmeDecorator
      WrappedComponent={TextInput}
      args={{
        ...args,
        value,
        setValue,
        ...useValidation(),
      }}
      Readme={Readme}
    />
  );
};

export default meta;

type Story = StoryObj<typeof TextInput>;

export const Basic: Story = {
  name: 'TextInput',
  render: Template,
};
