import * as prismic from '@prismicio/client';
import { Meta, StoryObj } from '@storybook/react';

import { image } from '@weco/cardigan/stories/data/images';
import PortraitVideoList from '@weco/content/views/components/PortraitVideoList';

const items = [
  {
    embedUrl: 'https://player.vimeo.com/video/613729649',
    videoProvider: 'Vimeo' as const,
    posterImage: image(),
    duration: '1:23 mins',
    title: 'What can we learn from cholera recovery on Vimeo?',
    transcript: [
      {
        type: 'paragraph' as const,
        text: 'In the nineteenth century, cholera swept through cities across the world, killing thousands. But some people recovered. What allowed them to survive, and what can we learn from their stories today?',
        spans: [],
      },
      {
        type: 'paragraph' as const,
        text: 'Historians and scientists are now piecing together the evidence — from patient records, to letters, to early clinical trials — to understand the biology of survival.',
        spans: [],
      },
    ] satisfies prismic.RichTextField,
  },
  {
    embedUrl: 'https://www.youtube.com/embed/OQjVA9ALpvY',
    videoProvider: 'YouTube' as const,
    posterImage: image(),
    duration: '2:45 mins',
    title: 'The biology of survival',
    transcript: [
      {
        type: 'paragraph' as const,
        text: 'This is a long transcript so it should be scrollable.',
        spans: [],
      },
      {
        type: 'paragraph' as const,
        text: "Researchers are uncovering how genetic variation shapes an individual's response to infection, offering new hope for treatments tailored to the person, not just the disease.",
        spans: [],
      },
      {
        type: 'paragraph' as const,
        text: 'Every cell in the human body carries instructions for both life and death. Understanding how those instructions are read — and misread — is at the heart of modern medicine.',
        spans: [],
      },
      {
        type: 'paragraph' as const,
        text: "Researchers are uncovering how genetic variation shapes an individual's response to infection, offering new hope for treatments tailored to the person, not just the disease.",
        spans: [],
      },
      {
        type: 'paragraph' as const,
        text: 'Every cell in the human body carries instructions for both life and death. Understanding how those instructions are read — and misread — is at the heart of modern medicine.',
        spans: [],
      },
      {
        type: 'paragraph' as const,
        text: "Researchers are uncovering how genetic variation shapes an individual's response to infection, offering new hope for treatments tailored to the person, not just the disease.",
        spans: [],
      },
      {
        type: 'paragraph' as const,
        text: 'Every cell in the human body carries instructions for both life and death. Understanding how those instructions are read — and misread — is at the heart of modern medicine.',
        spans: [],
      },
      {
        type: 'paragraph' as const,
        text: "Researchers are uncovering how genetic variation shapes an individual's response to infection, offering new hope for treatments tailored to the person, not just the disease.",
        spans: [],
      },
      {
        type: 'paragraph' as const,
        text: 'Every cell in the human body carries instructions for both life and death. Understanding how those instructions are read — and misread — is at the heart of modern medicine.',
        spans: [],
      },
      {
        type: 'paragraph' as const,
        text: "Researchers are uncovering how genetic variation shapes an individual's response to infection, offering new hope for treatments tailored to the person, not just the disease.",
        spans: [],
      },
    ] satisfies prismic.RichTextField,
  },
  {
    embedUrl: 'https://www.youtube.com/embed/Rgty5IrbhqE',
    videoProvider: 'YouTube' as const,
    posterImage: image(),
    duration: '3:10 mins',
    title: 'Patient records and early clinical trials',
    transcript: [
      {
        type: 'paragraph' as const,
        text: 'Before the randomised controlled trial became the gold standard, doctors kept meticulous notes on who recovered and who did not. Those records are now a treasure trove for epidemiologists.',
        spans: [],
      },
      {
        type: 'paragraph' as const,
        text: 'By digitising and analysing thousands of handwritten case histories, researchers are reconstructing how early clinicians tested remedies — and what they quietly discarded when the evidence did not hold up.',
        spans: [],
      },
    ] satisfies prismic.RichTextField,
  },
  {
    embedUrl: 'https://www.youtube.com/embed/5xkvL8NrQ88',
    videoProvider: 'YouTube' as const,
    posterImage: image(),
    duration: '1:55 mins',
    title: 'Letters from the epidemic',
    transcript: [
      {
        type: 'paragraph' as const,
        text: 'When disease struck, people wrote. They wrote to warn relatives, to grieve, and sometimes simply to make sense of what they were witnessing. Those letters have survived in archives around the world.',
        spans: [],
      },
      {
        type: 'paragraph' as const,
        text: 'Read together, they reveal how ordinary people understood contagion long before germ theory — and how fear, rumour, and solidarity shaped the human response to epidemic disease.',
        spans: [],
      },
    ] satisfies prismic.RichTextField,
  },
  {
    embedUrl: 'https://www.youtube.com/embed/FwyPPIhSpdA',
    videoProvider: 'YouTube' as const,
    posterImage: image(),
    duration: '1:23 mins',
    title: 'What can we learn from cholera recovery?',
    transcript: [
      {
        type: 'paragraph' as const,
        text: 'In the nineteenth century, cholera swept through cities across the world, killing thousands. But some people recovered. What allowed them to survive, and what can we learn from their stories today?',
        spans: [],
      },
      {
        type: 'paragraph' as const,
        text: 'Historians and scientists are now piecing together the evidence — from patient records, to letters, to early clinical trials — to understand the biology of survival.',
        spans: [],
      },
    ] satisfies prismic.RichTextField,
  },
];

const meta: Meta<typeof PortraitVideoList> = {
  title: 'Components/Media/PortraitVideoEmbedList',
  component: PortraitVideoList,
  args: {
    title: 'Short films',
    items,
    useShim: true,
  },
  argTypes: {
    items: { table: { disable: true } },
    gridSizes: { table: { disable: true } },
    useShim: { table: { disable: true } },
  },
  parameters: {
    chromatic: {
      viewports: [375, 1200],
    },
  },
};

export default meta;

type Story = StoryObj<typeof PortraitVideoList>;

export const Basic: Story = {
  name: 'PortraitVideoEmbedList',
};
