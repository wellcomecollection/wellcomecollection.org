import { faker } from '@faker-js/faker';
import { Meta, StoryObj } from '@storybook/react';
import { ComponentProps } from 'react';

import { workBasic } from '@weco/cardigan/stories/data/work';
import WorkCards from '@weco/content/views/components/WorkCards';

faker.seed(123);

const formatOptions = [
  { label: 'Books', id: 'a' },
  { label: 'E-books', id: 'a' },
  { label: 'Journals', id: 'd' },
  { label: 'E-journals', id: 'd' },
  { label: 'Student dissertations', id: 'w' },
  { label: 'Archives and manuscripts', id: 'h' },
  { label: 'Manuscripts', id: 'b' },
  { label: 'Born digital archives', id: 'hdig' },
  { label: 'Pictures', id: 'k' },
  { label: 'Digital images', id: 'q' },
  { label: 'Maps', id: 'q' },
  { label: 'Audio', id: 'i' },
  { label: 'Video', id: 'g' },
  { label: 'Music', id: 'c' },
  { label: 'Film', id: 'n' },
  { label: 'CD-Roms', id: 'm' },
  { label: 'Ephemera', id: 'l' },
  { label: '3-D objects', id: 'r' },
  { label: 'Mixed materials', id: 'p' },
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
      options: formatOptions.map(option => option.label),
      description: 'Work format (visible when hasImage is false)',
    },
    columns: {
      name: 'Columns',
    },
  },
  render: args => {
    const { numberOfCards, hasImage, format } = args;
    const selectedFormat = formatOptions.find(
      option => option.label === format
    );

    args.works = Array.from({ length: numberOfCards }).map(() => ({
      ...workBasic,
      title: faker.lorem.lines(),
      thumbnail: hasImage ? workBasic.thumbnail : undefined,
      workTypeId: selectedFormat?.id,
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
