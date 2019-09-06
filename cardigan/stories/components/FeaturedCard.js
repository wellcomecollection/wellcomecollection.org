import { storiesOf } from '@storybook/react';
import FeaturedCard from '../../../common/views/components/FeaturedCard/FeaturedCard';
import Readme from '../../../common/views/components/FeaturedCard/README.md';
import { image } from '../content';

const item = {
  promoImage: image(),
  labels: [{ url: null, text: 'Essay' }],
  title: 'Remote diagnosis from wee to the Web',
  promoText:
    'Medical practice might have moved on from when patients posted flasks of their urine for doctors to taste, but telehealth today keeps up the tradition of remote diagnosis – to our possible detriment.',
  url: '#',
};
const stories = storiesOf('Components', module);

stories.add('FeaturedCard', () => <FeaturedCard item={item} />, {
  readme: { sidebar: Readme },
});
