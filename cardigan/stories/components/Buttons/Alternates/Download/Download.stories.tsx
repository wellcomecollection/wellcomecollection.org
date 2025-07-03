import { Meta, StoryObj } from '@storybook/react';

import Download from '@weco/common/views/components/Download';

const meta: Meta<typeof Download> = {
  title: 'Components/Buttons/Alternates/Download',
  component: Download,
  args: {
    isInline: false,
    useDarkControl: false,
    downloadOptions: [
      { id: 'test', label: 'download small image', format: 'image/jpeg' },
      { id: 'test2', label: 'download large image', format: 'image/jpeg' },
      { id: 'test3', label: 'download video', format: 'video/mp4' },
    ],
  },
};

export default meta;

type Story = StoryObj<typeof Download>;

export const Basic: Story = {
  name: 'Download',
};
