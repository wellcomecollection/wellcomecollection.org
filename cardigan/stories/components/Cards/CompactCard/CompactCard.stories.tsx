import { Meta, StoryObj } from '@storybook/react';

import { squareImage } from '@weco/cardigan/stories/data/images';
import { singleLineOfText } from '@weco/cardigan/stories/data/text';
import PrismicImage from '@weco/common/views/components/PrismicImage/PrismicImage';
import CompactCard from '@weco/content/components/CompactCard/CompactCard';

const primaryLabelList = [{ text: 'Study day' }, { text: 'Schools' }];
const secondaryLabelList = [{ text: 'Speech-to-text' }];
const imageProps = squareImage();

const meta: Meta<typeof CompactCard> = {
  title: 'Components/Cards/CompactCard',
  component: CompactCard,
  args: {
    url: 'https://wellcomecollection.org',
    title: 'Wellcome Collection',
    description: singleLineOfText(),
    Image: <PrismicImage image={imageProps} quality="low" />,
    primaryLabels: primaryLabelList,
    secondaryLabels: secondaryLabelList,
    xOfY: { x: 1, y: 1 },
  },
  parameters: {
    gridSizes: {
      s: ['auto', 12],
      m: ['auto', 10],
      l: ['auto', 8],
      xl: ['auto', 8],
    },
  },
};

export default meta;

type Story = StoryObj<typeof CompactCard>;
export const CompactCardStory: Story = {
  name: 'CompactCard',
};
