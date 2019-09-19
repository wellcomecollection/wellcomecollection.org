import { storiesOf } from '@storybook/react';
import FilterDrawer from '../../../common/views/components/FilterDrawer/FilterDrawer';
import Readme from '../../../common/views/components/FilterDrawer/README.md';

const stories = storiesOf('Components', module);

stories.add('FilterDrawer', () => <FilterDrawer />, {
  readme: { sidebar: Readme },
});
