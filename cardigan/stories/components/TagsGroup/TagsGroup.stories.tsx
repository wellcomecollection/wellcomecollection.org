import { Meta, StoryObj } from '@storybook/react';

import { ReadmeDecorator } from '@weco/cardigan/config/decorators';
import TagsGroup from '@weco/content/components/TagsGroup';
import Readme from '@weco/content/components/TagsGroup/README.mdx';

const meta: Meta<typeof TagsGroup> = {
  title: 'Components/TagsGroup',
  component: TagsGroup,
  args: {
    title: 'Listen or subscribe on',
    tags: [
      {
        textParts: ['SoundCloud'],
        linkAttributes: {
          href: { pathname: '/', query: {} },
          as: { pathname: '/', query: {} },
        },
      },
      {
        textParts: ['Google Podcasts'],
        linkAttributes: {
          href: { pathname: '/', query: {} },
          as: { pathname: '/', query: {} },
        },
      },
      {
        textParts: ['Spotify'],
        linkAttributes: {
          href: { pathname: '/', query: {} },
          as: { pathname: '/', query: {} },
        },
      },
      {
        textParts: ['Apple'],
        linkAttributes: {
          href: { pathname: '/', query: {} },
          as: { pathname: '/', query: {} },
        },
      },
      {
        textParts: ['Player'],
        linkAttributes: {
          href: { pathname: '/', query: {} },
          as: { pathname: '/', query: {} },
        },
      },
    ],
  },
  argTypes: {
    tags: {
      table: {
        disable: true,
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof TagsGroup>;

export const Basic: Story = {
  name: 'TagsGroup',
  render: args => (
    <ReadmeDecorator WrappedComponent={TagsGroup} args={args} Readme={Readme} />
  ),
};
