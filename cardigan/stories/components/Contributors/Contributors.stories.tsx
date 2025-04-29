import { Meta, StoryObj } from '@storybook/react';

import { ReadmeDecorator } from '@weco/cardigan/config/decorators';
import { organisation, person } from '@weco/cardigan/stories/data/content';
import Contributors from '@weco/content/components/Contributors';
import Readme from '@weco/content/components/Contributors/README.mdx';

const meta: Meta<typeof Contributors> = {
  title: 'Components/Contributors',
  component: Contributors,
  args: {
    contributors: [
      {
        contributor: {
          ...person,
          type: 'people',
          id: 'xxx',
        },
        role: {
          id: 'xxx',
          title: 'Speaker',
        },
      },
      {
        contributor: {
          ...organisation,
          type: 'organisations',
          id: '123',
        },
        role: {
          id: 'xxx',
          title: 'Partner',
        },
      },
    ],
  },
};

export default meta;

type Story = StoryObj<typeof Contributors>;

export const Basic: Story = {
  name: 'Contributors',
  render: args => (
    <ReadmeDecorator
      WrappedComponent={Contributors}
      args={args}
      Readme={Readme}
    />
  ),
};
