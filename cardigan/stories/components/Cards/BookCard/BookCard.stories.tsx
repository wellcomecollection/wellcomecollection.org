import { Meta, StoryObj } from '@storybook/react';

import { bookImageUrl, image } from '@weco/cardigan/stories/data/images';
import { singleLineOfText } from '@weco/cardigan/stories/data/text';
import BookCard from '@weco/content/views/components/CardGrid/CardGrid.BookCard';

const meta: Meta<typeof BookCard> = {
  title: 'Components/Cards/BookCard',
  component: BookCard,
  args: {
    book: {
      id: 'cardigan',
      uid: 'cardigan',
      type: 'books',
      labels: [],
      cover: image(bookImageUrl, 575, 884),
      title: singleLineOfText(),
      subtitle: singleLineOfText(),
    },
  },
  argTypes: {
    book: { table: { disable: true } },
  },
  parameters: {
    gridSizes: {
      s: [12],
      m: [6],
      l: [4],
      xl: [4],
    },
  },
};

export default meta;

type Story = StoryObj<typeof BookCard>;

export const Basic: Story = {
  name: 'BookCard',
};
