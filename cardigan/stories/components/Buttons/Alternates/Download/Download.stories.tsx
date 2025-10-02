import { Meta, StoryObj } from '@storybook/react';

import Download from '@weco/content/views/components/Download';

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
  argTypes: {
    isInline: { control: 'boolean', name: 'Is inline' },
    useDarkControl: { control: 'boolean', name: 'Use dark control' },
    downloadOptions: { table: { disable: true } },
    ariaControlsId: { table: { disable: true } },
  },
};

export default meta;

type Story = StoryObj<typeof Download>;

export const Basic: Story = {
  name: 'Download',
  render: args => {
    const { useDarkControl } = args;

    return (
      <div
        style={{
          backgroundColor: useDarkControl ? 'black' : 'transparent',
          padding: 20,
        }}
      >
        <Download {...args} />
      </div>
    );
  },
};
