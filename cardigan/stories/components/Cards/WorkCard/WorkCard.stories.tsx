import { Meta, StoryObj } from '@storybook/react';

import WorkCard from '@weco/content/views/components/WorkCard';

type StoryArgs = {
  title: string;
  labels: string;
  meta: string;
};

const meta: Meta<StoryArgs> = {
  title: 'Components/Cards/WorkCard',
  component: WorkCard,
  args: {
    title: 'Scans of drawings used as newsletter covers',
    labels: 'Born-digital archives',
    meta: 'Part of: David Beales: archive',
  },
  argTypes: {
    title: {
      name: 'Title',
      control: { type: 'text' },
    },
    labels: {
      name: 'Labels',
      control: { type: 'text' },
      description: 'Comma-separated list of labels',
    },
    meta: {
      name: 'Meta',
      control: { type: 'text' },
    },
  },
  render: args => {
    const labelsArray = args.labels
      ? args.labels.split(',').map(label => ({ text: label.trim() }))
      : [];

    return (
      <WorkCard
        item={{
          url: 'https://wellcomecollection.org/works/ptfqa2te',
          title: args.title,
          image: {
            contentUrl:
              'https://iiif.wellcomecollection.org/thumbs/PPDBL_A_7---DAYCENTRE2.BMP/full/291,400/0/default.jpg',
            width: 291,
            height: 400,
            alt: 'Scans of drawings used as newsletter covers',
          },
          labels: labelsArray,
          meta: args.meta,
        }}
      />
    );
  },
  parameters: {
    gridSizes: {
      s: [12],
      m: [6],
      l: [4],
      xl: [3],
    },
    docs: {
      description: {
        component:
          'A card component for displaying work items with image, title, labels, and metadata.',
      },
    },
  },
};

export default meta;

type Story = StoryObj<StoryArgs>;

export const Default: Story = {
  name: 'WorkCard',
};
