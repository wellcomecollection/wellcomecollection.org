import { Meta, StoryObj } from '@storybook/react';

import DownloadLink from '@weco/common/views/components/DownloadLink';

const meta: Meta<typeof DownloadLink> = {
  title: 'Components/DownloadLink',
  component: DownloadLink,
  args: {
    href: '/',
    linkText: 'Download file',
    format: 'PDF',
  },
};

export default meta;

type Story = StoryObj<typeof DownloadLink>;

export const Basic: Story = {
  name: 'DownloadLink',
};
