import { Meta, StoryObj } from '@storybook/react';

import { squareImage } from '@weco/cardigan/stories/data/images';
import { licenseTypeArray } from '@weco/common/model/license';
import Tasl from '@weco/common/views/components/Tasl';

const imageProps = squareImage();

const meta: Meta<typeof Tasl> = {
  title: 'Components/Tasl',
  component: Tasl,
  args: {
    ...imageProps.tasl,
    positionTop: true,
    copyrightHolder: 'Wellcome Collection',
    copyrightLink: 'https://wellcomecollection.org',
  },
  argTypes: {
    idSuffix: { table: { disable: true } },
    license: {
      control: {
        type: 'select',
      },
      options: licenseTypeArray,
    },
  },
};

export default meta;

type Story = StoryObj<typeof Tasl>;

export const Basic: Story = {
  name: 'Tasl',
  render: args => <Tasl {...args} />,
};
