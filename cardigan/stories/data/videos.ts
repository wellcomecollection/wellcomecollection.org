import * as prismic from '@prismicio/client';

import { EmbedSlice as RawEmbedSlice } from '@weco/common/prismicio-types';
import { transformEmbedSlice } from '@weco/content/services/prismic/transformers/body';
import { PortraitVideoItem } from '@weco/content/views/components/PortraitVideoList';

import { image } from './images';

const videoEmbedSlice = (video: prismic.EmbedField) =>
  ({
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
  }) as RawEmbedSlice;

const youtubeEmbedSlice: prismic.EmbedField = {
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

const vimeoEmbedSlice: prismic.EmbedField = {
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

export const transformedVimeoEmbed = transformEmbedSlice(
  videoEmbedSlice(vimeoEmbedSlice)
)!.value;
export const transformedYoutubeEmbed = transformEmbedSlice(
  videoEmbedSlice(youtubeEmbedSlice)
)!.value;

export const portraitVideoItems: PortraitVideoItem[] = [
  {
    embedUrl: 'https://player.vimeo.com/video/613729649',
    videoProvider: 'Vimeo',
    posterImage: image(),
    duration: '1:23 mins',
    title: 'What can we learn from cholera recovery on Vimeo?',
    transcript: [
      {
        type: 'paragraph',
        text: 'In the nineteenth century, cholera swept through cities across the world, killing thousands. But some people recovered. What allowed them to survive, and what can we learn from their stories today?',
        spans: [],
      },
      {
        type: 'paragraph',
        text: 'Historians and scientists are now piecing together the evidence — from patient records, to letters, to early clinical trials — to understand the biology of survival.',
        spans: [],
      },
    ] as prismic.RichTextField,
  },
  {
    embedUrl: 'https://www.youtube.com/embed/OQjVA9ALpvY',
    videoProvider: 'YouTube',
    posterImage: image(),
    duration: '2:45 mins',
    title: 'The biology of survival',
    transcript: [
      {
        type: 'paragraph',
        text: 'This is a long transcript so it should be scrollable.',
        spans: [],
      },
      {
        type: 'paragraph',
        text: "Researchers are uncovering how genetic variation shapes an individual's response to infection, offering new hope for treatments tailored to the person, not just the disease.",
        spans: [],
      },
      {
        type: 'paragraph',
        text: 'Every cell in the human body carries instructions for both life and death. Understanding how those instructions are read — and misread — is at the heart of modern medicine.',
        spans: [],
      },
      {
        type: 'paragraph',
        text: "Researchers are uncovering how genetic variation shapes an individual's response to infection, offering new hope for treatments tailored to the person, not just the disease.",
        spans: [],
      },
      {
        type: 'paragraph',
        text: 'Every cell in the human body carries instructions for both life and death. Understanding how those instructions are read — and misread — is at the heart of modern medicine.',
        spans: [],
      },
      {
        type: 'paragraph',
        text: "Researchers are uncovering how genetic variation shapes an individual's response to infection, offering new hope for treatments tailored to the person, not just the disease.",
        spans: [],
      },
      {
        type: 'paragraph',
        text: 'Every cell in the human body carries instructions for both life and death. Understanding how those instructions are read — and misread — is at the heart of modern medicine.',
        spans: [],
      },
      {
        type: 'paragraph',
        text: "Researchers are uncovering how genetic variation shapes an individual's response to infection, offering new hope for treatments tailored to the person, not just the disease.",
        spans: [],
      },
      {
        type: 'paragraph',
        text: 'Every cell in the human body carries instructions for both life and death. Understanding how those instructions are read — and misread — is at the heart of modern medicine.',
        spans: [],
      },
      {
        type: 'paragraph',
        text: "Researchers are uncovering how genetic variation shapes an individual's response to infection, offering new hope for treatments tailored to the person, not just the disease.",
        spans: [],
      },
    ] as prismic.RichTextField,
  },
  {
    embedUrl: 'https://www.youtube.com/embed/Rgty5IrbhqE',
    videoProvider: 'YouTube',
    posterImage: image(),
    duration: '3:10 mins',
    title: 'Patient records and early clinical trials',
    transcript: [
      {
        type: 'paragraph',
        text: 'Before the randomised controlled trial became the gold standard, doctors kept meticulous notes on who recovered and who did not. Those records are now a treasure trove for epidemiologists.',
        spans: [],
      },
      {
        type: 'paragraph',
        text: 'By digitising and analysing thousands of handwritten case histories, researchers are reconstructing how early clinicians tested remedies — and what they quietly discarded when the evidence did not hold up.',
        spans: [],
      },
    ] as prismic.RichTextField,
  },
  {
    embedUrl: 'https://www.youtube.com/embed/5xkvL8NrQ88',
    videoProvider: 'YouTube',
    posterImage: image(),
    duration: '1:55 mins',
    title: 'Letters from the epidemic',
    transcript: [
      {
        type: 'paragraph',
        text: 'When disease struck, people wrote. They wrote to warn relatives, to grieve, and sometimes simply to make sense of what they were witnessing. Those letters have survived in archives around the world.',
        spans: [],
      },
      {
        type: 'paragraph',
        text: 'Read together, they reveal how ordinary people understood contagion long before germ theory — and how fear, rumour, and solidarity shaped the human response to epidemic disease.',
        spans: [],
      },
    ] as prismic.RichTextField,
  },
  {
    embedUrl: 'https://www.youtube.com/embed/FwyPPIhSpdA',
    videoProvider: 'YouTube',
    posterImage: image(),
    duration: '1:23 mins',
    title: 'What can we learn from cholera recovery?',
    transcript: [
      {
        type: 'paragraph',
        text: 'In the nineteenth century, cholera swept through cities across the world, killing thousands. But some people recovered. What allowed them to survive, and what can we learn from their stories today?',
        spans: [],
      },
      {
        type: 'paragraph',
        text: 'Historians and scientists are now piecing together the evidence — from patient records, to letters, to early clinical trials — to understand the biology of survival.',
        spans: [],
      },
    ] as prismic.RichTextField,
  },
];
