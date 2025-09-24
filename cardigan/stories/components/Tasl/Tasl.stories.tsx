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
    positionTop: { name: 'Display Tasl at the top', control: 'boolean' },
    copyrightHolder: { name: 'Copyright holder', control: 'text' },
    copyrightLink: { name: 'Copyright link', control: 'text' },
    sourceLink: { name: 'Source link', control: 'text' },
    sourceName: { name: 'Source', control: 'text' },
    author: { name: 'Author', control: 'text' },
    title: { name: 'Title', control: 'text' },
    license: {
      name: 'License type',
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
  render: args => (
    <>
      <span>Click right-hand icon to open</span>
      <Tasl {...args} />
    </>
  ),
};
