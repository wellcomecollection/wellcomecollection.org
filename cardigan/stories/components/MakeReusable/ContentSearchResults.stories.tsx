import { Meta, StoryObj } from '@storybook/react';
import { useEffect, useState } from 'react';

import {
  contentAPIAddressableArticle,
  contentAPIAddressableEvent,
  contentAPIAddressableExhibition,
} from '@weco/cardigan/stories/data/content';
import ContentSearchResult from '@weco/content/components/ContentSearchResult';

const meta: Meta<typeof ContentSearchResult> = {
  title: 'To be made reusable/ContentSearchResult',
  component: ContentSearchResult,
  args: contentAPIAddressableEvent,
  argTypes: {
    uid: { table: { disable: true } },
    dates: { table: { disable: true } },
    times: { table: { disable: true } },
    positionInList: { table: { disable: true } },
    highlightTourType: { table: { disable: true } },
    tags: { table: { disable: true } },
    type: {
      options: ['Event', 'Exhibition', 'Article'],
      control: { type: 'select' },
    },
    contributors: { table: { disable: true } },
  },
};

export default meta;

type Story = StoryObj<typeof ContentSearchResult>;

const Template = args => {
  const { type } = args;
  const [finalArgs, setFinalArgs] = useState(args);

  useEffect(() => {
    switch (type) {
      case 'Article':
        setFinalArgs({
          ...contentAPIAddressableArticle,
        });
        break;
      case 'Event':
        setFinalArgs({
          ...contentAPIAddressableEvent,
        });
        break;
      case 'Exhibition':
        setFinalArgs({
          ...contentAPIAddressableExhibition,
        });
        break;
      default:
        setFinalArgs(args);
    }
  }, [type]);

  return <ContentSearchResult {...finalArgs} />;
};

export const Basic: Story = {
  name: 'ContentSearchResult',
  render: Template,
};
