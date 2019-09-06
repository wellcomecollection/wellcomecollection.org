import { storiesOf } from '@storybook/react';
import FeaturedCard from '../../../common/views/components/FeaturedCard/FeaturedCard';
import Readme from '../../../common/views/components/FeaturedCard/README.md';

const stories = storiesOf('Components', module);

stories.add('FeaturedCard', () => <FeaturedCard />, {
  readme: { sidebar: Readme },
});
