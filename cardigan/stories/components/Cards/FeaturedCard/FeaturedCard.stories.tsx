import { Meta, StoryObj } from '@storybook/react';

import { ReadmeDecorator } from '@weco/cardigan/config/decorators';
import { image } from '@weco/cardigan/stories/data/images';
import { font } from '@weco/common/utils/classnames';
import FeaturedCard from '@weco/content/components/FeaturedCard';
import Readme from '@weco/content/components/FeaturedCard/README.mdx';

const meta: Meta<typeof FeaturedCard> = {
  title: 'Components/Cards/FeaturedCard',
  component: FeaturedCard,
  args: {
    image: image(),
    labels: [{ text: 'Article' }],
    link: { url: '#', text: 'Remote diagnosis from wee to the web' },
    background: 'neutral.700',
    textColor: 'white',
    isReversed: false,
  },
};

export default meta;

type Story = StoryObj<typeof FeaturedCard>;
export const Basic: Story = {
  name: 'FeaturedCard',
  render: args => (
    <ReadmeDecorator
      WrappedComponent={FeaturedCard}
      args={{
        id: 'id',
        image: image(),
        labels: [{ text: 'Article' }],
        link: { url: '#', text: 'Remote diagnosis from wee to the web' },
        background: args.background,
        textColor: args.textColor,
        isReversed: args.isReversed,
      }}
      Readme={Readme}
    >
      <h2 className={font('wb', 2)}>Remote diagnosis from wee to the Web</h2>
      <p className={font('intr', 5)}>
        Medical practice might have moved on from when patients posted flasks of
        their urine for doctors to taste, but telehealth today keeps up the
        tradition of remote diagnosis – to our possible detriment.
      </p>
    </ReadmeDecorator>
  ),
};
