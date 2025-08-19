import { Meta, StoryObj } from '@storybook/react';

import DownloadLink from '@weco/common/views/components/DownloadLink';

const meta: Meta<typeof DownloadLink> = {
  title: 'Components/DownloadLink',
  component: DownloadLink,
  args: {
    href: '/',
    linkText: 'Download file',
    format: 'PDF',
    isDark: false,
  },
  argTypes: {
    href: { table: { disable: true } },
    trackingTags: { table: { disable: true } },
    isTabbable: { table: { disable: true } },
    width: { table: { disable: true } },
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
  args: {
    width: 30,
  },
  name: 'DownloadLink',
  render: args => {
    return (
      <div style={{ backgroundColor: args.isDark ? '#333' : 'transparent' }}>
        <DownloadLink {...args} />
      </div>
    );
  },
};
