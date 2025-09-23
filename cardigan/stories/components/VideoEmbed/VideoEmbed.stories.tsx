import * as prismic from '@prismicio/client';
import { Meta, StoryObj } from '@storybook/react';
import { ComponentProps } from 'react';

import VideoEmbed from '@weco/common/views/components/VideoEmbed';
import { transformEmbedSlice } from '@weco/content/services/prismic/transformers/body';

const youtube = {
  embed_url: 'https://youtu.be/1bmRUZLqYSw',
  provider_name: 'YouTube',
  provider_url: 'https://www.youtube.com/',
  title: 'BSL welcome to Rooted Beings',
  author_name: 'Wellcome Collection',
  author_url: 'https://www.youtube.com/@WellcomeCollection',
  type: 'rich',
  height: 113,
  width: 200,
  version: '1.0',
  thumbnail_height: 360,
  thumbnail_width: 480,
  thumbnail_url: 'https://i.ytimg.com/vi/1bmRUZLqYSw/hqdefault.jpg',
  html: '<iframe width="200" height="113" src="https://www.youtube.com/embed/1bmRUZLqYSw?feature=oembed" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen title="BSL welcome to Rooted Beings"></iframe>',
};

const vimeo = {
  embed_url: 'https://vimeo.com/1031076960',
  type: 'rich',
  version: '1.0',
  title: 'Stop 09 Hippo Scare',
  author_name: 'Wellcome Collection',
  author_url: 'https://vimeo.com/user20995702',
  provider_name: 'Vimeo',
  provider_url: 'https://vimeo.com/',
  thumbnail_url:
    'https://i.vimeocdn.com/video/1951742749-6117aed1a9e29099e986930ea10c9691bd0326544c86a5b8d97ac8b0f9f31e4d-d_295x166',
  thumbnail_width: 295,
  thumbnail_height: 166,
  html: '<iframe src="https://player.vimeo.com/video/1031076960?app_id=122963" width="426" height="240" frameborder="0" allow="autoplay; fullscreen; picture-in-picture; clipboard-write" title="Stop 09 Hippo Scare"></iframe>',
  is_plus: '1',
  account_type: 'plus',
  width: 426,
  height: 240,
  duration: 188,
  description: '',
  thumbnail_url_with_play_button:
    'https://i.vimeocdn.com/filter/overlay?src0=https%3A%2F%2Fi.vimeocdn.com%2Fvideo%2F1951742749-6117aed1a9e29099e986930ea10c9691bd0326544c86a5b8d97ac8b0f9f31e4d-d_295x166&src1=http%3A%2F%2Ff.vimeocdn.com%2Fp%2Fimages%2Fcrawler_play.png',
  upload_date: '2024-11-19 05:24:24',
  video_id: 1031076960,
  uri: '/videos/1031076960',
};

type StoryProps = ComponentProps<typeof VideoEmbed> & {
  hasTranscript: boolean;
  hasCaption: boolean;
};

const videoEmbedSlice = video => ({
  variation: 'default' as const,
  version: 'initial',
  items: [] as never[],
  primary: {
    embed: video,
    caption: [
      {
        type: 'paragraph',
        text: 'Video caption goes here.',
        spans: [],
      },
    ] as prismic.RichTextField,
    transcript: [
      {
        type: 'paragraph',
        text: 'Welcome to ‘Rooted Beings’, an exhibition that asks us to reimagine our relationship with plants through new artworks and historic objects from Wellcome Collection and Kew Gardens. ',
        spans: [],
      },
      {
        type: 'paragraph',
        text: 'Follow the BSL symbols on the object labels and scan the QR codes on your phone to watch me interpret two of the artworks: Eduardo Navarro and Michael Marder’s meditation on how to become more like plants, and Sop’s work ‘The Den’, on finding solace in nature. ',
        spans: [],
      },
      {
        type: 'paragraph',
        text: 'There are also several large artworks and installations within the gallery space, two of which have sound played out loud: Patricia Domínguez’s installation in the centre of the gallery and in the corridor as you exit, and Sop’s film work near the end of the exhibition.',
        spans: [],
      },
    ] as prismic.RichTextField,
  },
  id: 'embed$9db10ceb-78db-43e1-8951-680acec907fb',
  slice_type: 'embed' as const,
  slice_label: null,
});

const meta: Meta<StoryProps> = {
  title: 'Components/VideoEmbed',
  component: VideoEmbed,
  args: {
    ...transformEmbedSlice(videoEmbedSlice(youtube)).value,
    hasFullSizePoster: true,
    hasTranscript: true,
    hasCaption: true,
  },
  argTypes: {
    embedUrl: { table: { disable: true } },
    transcript: { table: { disable: true } },
    caption: { table: { disable: true } },
    videoThumbnail: { table: { disable: true } },
    videoProvider: {
      name: 'Video provider',
      control: { type: 'radio' },
      options: ['YouTube', 'Vimeo'],
    },
    hasFullSizePoster: {
      if: { arg: 'videoProvider', eq: 'YouTube' },
      control: 'boolean',
      name: 'Use full size YouTube poster image',
    },
    hasTranscript: { control: 'boolean', name: 'Has transcript' },
    hasCaption: { control: 'boolean', name: 'Has caption' },
  },
};

export default meta;

type Story = StoryObj<StoryProps>;

export const Basic: Story = {
  name: 'VideoEmbed',
  render: args => {
    const finalArgs = {
      ...args,
      ...transformEmbedSlice(
        videoEmbedSlice(args.videoProvider === 'YouTube' ? youtube : vimeo)
      ).value,
      transcript: args.hasTranscript
        ? args.transcript
        : ([] as prismic.RichTextField),
      caption: args.hasCaption ? args.caption : ([] as prismic.RichTextField),
    };
    return <VideoEmbed {...finalArgs} />;
  },
};
