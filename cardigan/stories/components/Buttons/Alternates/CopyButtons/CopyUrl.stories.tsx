import { Meta, StoryObj } from '@storybook/react';
import { useEffect, useState } from 'react';

import { ReadmeDecorator } from '@weco/cardigan/config/decorators';
import CopyButtons from '@weco/content/views/components/CopyButtons';
import Readme from '@weco/content/views/components/CopyButtons/README.mdx';

const contentArgs = {
  CTA: 'Copy content',
  content: 'This is some example content to copy.',
  displayedContent: <span>This is some example content to copy.</span>,
};

const urlArgs = { url: 'https://wellcomecollection.org/works/t59c279p' };

const meta: Meta<typeof CopyButtons> = {
  title: 'Components/Buttons/Alternates/CopyButtons',
  component: CopyButtons,
  args: {
    variant: 'url',
    ...urlArgs,
  },
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['content', 'url'],
    },
    url: { table: { disable: true } },
  },
};

export default meta;

type Story = StoryObj<typeof CopyButtons>;

const CopyButtonsStory = args => {
  const { variant } = args;
  const [finalArgs, setFinalArgs] = useState(args);

  useEffect(() => {
    setFinalArgs({
      variant,
      ...(variant === 'content' ? contentArgs : urlArgs),
    });
  }, [variant]);

  return (
    <ReadmeDecorator
      WrappedComponent={CopyButtons}
      args={finalArgs}
      Readme={Readme}
    />
  );
};

export const Basic: Story = {
  name: 'CopyButtons',
  render: args => <CopyButtonsStory {...args} />,
};
