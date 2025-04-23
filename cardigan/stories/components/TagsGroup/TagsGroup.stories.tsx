import { Meta, StoryObj } from '@storybook/react';

import { ReadmeDecorator } from '@weco/cardigan/config/decorators';
import Readme from '@weco/content/components/TagsGroup/README.mdx';
import TagsGroup from '@weco/content/components/TagsGroup';

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
};

export default meta;

type Story = StoryObj<typeof TagsGroup>;

export const Basic: Story = {
  name: 'TagsGroup',
  render: args => (
    <ReadmeDecorator WrappedComponent={TagsGroup} args={args} Readme={Readme} />
  ),
};
