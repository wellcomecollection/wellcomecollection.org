import { Meta, StoryObj } from '@storybook/react';

import { bookImageUrl, image } from '@weco/cardigan/stories/data/images';
import { singleLineOfText } from '@weco/cardigan/stories/data/text';
import BookPromo from '@weco/content/components/BookPromo/BookPromo';

const meta: Meta<typeof BookPromo> = {
  title: 'Components/Cards/BookPromo',
  component: BookPromo,
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
  parameters: {
    gridSizes: {
      s: [12],
      m: [6],
      l: [4],
      xl: ['auto', 4],
    },
  },
};

export default meta;

type Story = StoryObj<typeof BookPromo>;

export const Basic: Story = {
  name: 'BookPromo',
};
