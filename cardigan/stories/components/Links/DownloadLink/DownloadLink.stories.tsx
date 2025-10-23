import { Meta, StoryObj } from '@storybook/react';

import DownloadLink from '@weco/common/views/components/DownloadLink';

const meta: Meta<typeof DownloadLink> = {
  title: 'Components/Links/DownloadLink',
  component: DownloadLink,
  args: {
    href: '/',
    linkText: 'Download file',
    format: 'PDF',
    isDark: false,
  },
  argTypes: {
    href: { table: { disable: true } },
    isTabbable: { table: { disable: true } },
    mimeType: { table: { disable: true } },
    linkText: {
      name: 'Text',
    },
    format: {
      name: 'Format',
      control: 'radio',
      options: ['PDF', 'JPEG', 'MP3', undefined],
    },
    isDark: {
      name: 'isDark: is on a dark background',
      control: 'boolean',
    },
  },
};

export default meta;

type Story = StoryObj<typeof DownloadLink>;

export const Basic: Story = {
  name: 'DownloadLink',
  render: args => {
    return (
      <div style={{ backgroundColor: args.isDark ? '#333' : 'transparent' }}>
        <DownloadLink {...args} />
      </div>
    );
  },
};
