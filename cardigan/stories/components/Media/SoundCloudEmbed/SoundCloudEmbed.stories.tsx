import { Meta, StoryObj } from '@storybook/react';
import { ComponentProps } from 'react';

import { EmbedSlice as RawEmbedSlice } from '@weco/common/prismicio-types';
import { transformEmbedSlice } from '@weco/content/services/prismic/transformers/body';
import SoundCloudEmbed from '@weco/content/views/components/SoundCloudEmbed';

type StoryProps = ComponentProps<typeof SoundCloudEmbed> & {
  hasCaption: boolean;
  hasTranscript: boolean;
};

const soundCloudEmbedSlice: RawEmbedSlice = {
  variation: 'default',
  version: 'initial',
  items: [],
  primary: {
    embed: {
      embed_url:
        'https://soundcloud.com/wellcomecollection/giving-shape-to-sound-by-jamie-hale/s-LcDFmzwpGWX',
      provider_name: 'SoundCloud',
      provider_url: 'https://soundcloud.com',
      version: '1.0',
      type: 'rich',
      height: 400,
      width: 100,
      title: 'Giving shape to sound by Jamie Hale by Wellcome Collection',
      description: '',
      thumbnail_url: 'https://soundcloud.com/images/fb_placeholder.png',
      html: '<iframe width="100%" height="400" scrolling="no" frameborder="no" src="https://w.soundcloud.com/player/?visual=true&url=https%3A%2F%2Fapi.soundcloud.com%2Ftracks%2F885555574&show_artwork=true&secret_token=s-LcDFmzwpGWX"></iframe>',
      author_name: 'Wellcome Collection',
      author_url: 'https://soundcloud.com/wellcomecollection',
    },
    caption: [],
    transcript: [],
  },
  id: 'embed$a3387972-d505-49e2-9dd4-839ef70c7b1a',
  slice_type: 'embed',
  slice_label: null,
};

const transformedSlice = transformEmbedSlice(soundCloudEmbedSlice)!;

const meta: Meta<StoryProps> = {
  title: 'Components/Media/SoundCloudEmbed',
  component: SoundCloudEmbed,
  args: {
    ...transformedSlice.value,
    hasCaption: false,
    hasTranscript: false,
  },
  argTypes: {
    id: { table: { disable: true } },
    embedUrl: { table: { disable: true } },
    caption: { table: { disable: true } },
    transcript: { table: { disable: true } },
    hasCaption: {
      control: 'boolean',
      name: 'With caption',
    },
    hasTranscript: {
      control: 'boolean',
      name: 'With transcript',
    },
  },
};

export default meta;

type Story = StoryObj<StoryProps>;

export const Basic: Story = {
  name: 'SoundCloudEmbed',
  render: args => {
    const { hasCaption, hasTranscript, ...rest } = args;

    return (
      <SoundCloudEmbed
        {...rest}
        caption={
          hasCaption
            ? [{ type: 'paragraph', text: 'This is a caption', spans: [] }]
            : []
        }
        transcript={
          hasTranscript
            ? [
                {
                  type: 'paragraph',
                  text: 'This is a transcript. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
                  spans: [],
                },
              ]
            : []
        }
      />
    );
  },
};
