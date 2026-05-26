import { faker } from '@faker-js/faker';
import { Meta, StoryObj } from '@storybook/react';
import { ComponentProps } from 'react';

import { workBasic } from '@weco/cardigan/stories/data/work';
import WorkCards from '@weco/content/views/components/WorkCards';

faker.seed(123);

const formatOptions = [
  'Books',
  'E-books',
  'Journals',
  'E-journals',
  'Student dissertations',
  'Archives and manuscripts',
  'Manuscripts',
  'Born digital archives',
  'Pictures',
  'Digital images',
  'Maps',
  'Audio',
  'Video',
  'Music',
  'Film',
  'CD-Roms',
  'Ephemera',
  '3-D objects',
  'Mixed materials',
];

// Extend the story type
type StoryProps = ComponentProps<typeof WorkCards> & {
  numberOfCards: number;
  hasImage?: boolean;
  format?: string;
};

const meta: Meta<StoryProps> = {
  title: 'Components/Cards/WorkCards',
  component: WorkCards,
  args: {
    works: [workBasic],
    numberOfCards: 1,
    hasImage: true,
    format: 'Books',
    columns: 4,
  },
  argTypes: {
    works: { table: { disable: true } },
    numberOfCards: {
      name: 'Number of cards',
      control: {
        type: 'range',
        min: 1,
        max: 10,
      },
    },
    hasImage: { name: 'Has image', control: 'boolean' },
    format: {
      name: 'Work format',
      control: 'select',
      options: formatOptions,
      description: 'Work format (visible when hasImage is false)',
    },
    columns: {
      name: 'Columns',
    },
  },
  render: args => {
    const { numberOfCards, hasImage, format } = args;
    args.works = Array.from({ length: numberOfCards }).map(() => ({
      ...workBasic,
      title: faker.lorem.lines(),
      thumbnail: hasImage ? workBasic.thumbnail : undefined,
      cardLabels: format
        ? [{ text: format }, { text: 'Online', labelColor: 'white' }]
        : workBasic.cardLabels,
    }));

    if (args.works.length === 1) {
      return (
        <div style={{ maxWidth: '300px' }}>
          <WorkCards works={args.works} />
        </div>
      );
    }

    return <WorkCards {...args} />;
  },
  parameters: {
    gridSizes: {
      s: [12],
      m: [12],
      l: [12],
      xl: [12],
    },
  },
};

export default meta;

type Story = StoryObj<StoryProps>;

export const Default: Story = {
  name: 'WorkCards',
};
