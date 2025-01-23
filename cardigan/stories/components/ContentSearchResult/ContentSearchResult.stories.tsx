import { Meta, StoryObj } from '@storybook/react';

import ContentSearchResult from '@weco/content/components/ContentSearchResult/ContentSearchResult';

const meta: Meta<typeof ContentSearchResult> = {
  title: 'Components/ContentSearchResult',
  component: ContentSearchResult,
  args: {
    uid: 'shortlist-revealed-for-wellcome-book-prize-2018',
    contributors: 'Joe Bloggs',
    dates: {
      start: new Date('2022-03-01T00:00:00Z'),
      end: new Date('2022-03-08T00:00:00Z'),
    },
    times: {
      start: new Date('2022-03-01T13:15:00Z'),
      end: new Date('2022-03-01T14:15:00Z'),
    },
    description:
      'The shortlist for the 2018 Wellcome Book Prize is announced, celebrating the best new books that illuminate our encounters with health, medicine and illness.',
    title: 'Shortlist revealed for Wellcome Book Prize 2018',
    type: 'Page',
    tags: ['press'],
  },
};

export default meta;

type Story = StoryObj<typeof ContentSearchResult>;

const Template = args => <ContentSearchResult {...args} />;

export const Basic: Story = {
  name: 'ContentSearchResult',
  render: Template,
};
