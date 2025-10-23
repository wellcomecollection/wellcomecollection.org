import { Meta, StoryObj } from '@storybook/react';

import WorkCard, { WorkItem } from '@weco/content/views/components/WorkCard';

type StoryProps = Omit<WorkItem, 'labels'> & {
  labelsList: string;
  item: WorkItem;
};

const meta: Meta<StoryProps> = {
  title: 'Components/Cards/WorkCard',
  component: WorkCard,
  args: {
    title: 'Scans of drawings used as newsletter covers',
    labelsList: 'Born-digital archives',
    partOf: 'David Beales: archive',
    contributor: 'Tooley, Sarah A., 1857-',
    date: 'c.1990s-c.2000s',
  },
  argTypes: {
    item: { table: { disable: true } },
    title: {
      name: 'Title',
      control: { type: 'text' },
    },
    labelsList: {
      name: 'Labels',
      control: { type: 'text' },
      description: 'Comma-separated list of labels',
    },
    partOf: {
      name: 'Part of',
      control: { type: 'text' },
    },
    contributor: {
      name: 'Contributor',
      control: { type: 'text' },
    },
    date: {
      name: 'Date',
      control: { type: 'text' },
    },
  },
  render: args => {
    const labelsArray = args.labelsList
      ? args.labelsList.split(',').map(label => ({ text: label.trim() }))
      : [];

    return (
      <WorkCard
        item={{
          ...args,
          url: 'https://wellcomecollection.org/works/ptfqa2te',
          image: {
            contentUrl:
              'https://iiif.wellcomecollection.org/thumbs/PPDBL_A_7---DAYCENTRE2.BMP/full/291,400/0/default.jpg',
            width: 291,
            height: 400,
            alt: 'Scans of drawings used as newsletter covers',
          },
          labels: labelsArray,
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

type Story = StoryObj<StoryProps>;

export const Default: Story = {
  name: 'WorkCard',
};
