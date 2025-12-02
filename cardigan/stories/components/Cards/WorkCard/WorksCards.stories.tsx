import { faker } from '@faker-js/faker';
import { Meta, StoryObj } from '@storybook/react';
import { ComponentProps } from 'react';

import { workBasic } from '@weco/cardigan/stories/data/work';
import WorkCards from '@weco/content/views/components/WorkCard/WorkCards';

faker.seed(123);

// Extend the story type
type StoryProps = ComponentProps<typeof WorkCards> & {
  numberOfCards: number;
};

const meta: Meta<StoryProps> = {
  title: 'Components/Cards/WorkCards',
  component: WorkCards,
  args: {
    works: [workBasic],
    numberOfCards: 1,
  },
  argTypes: {
    works: { table: { disable: true } },
    numberOfCards: {
      control: {
        type: 'range',
        min: 1,
        max: 10,
      },
    },
  },
  render: args => {
    const { numberOfCards } = args;
    args.works = Array.from({ length: numberOfCards }).map(() => ({
      ...workBasic,
      title: faker.lorem.lines(),
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
