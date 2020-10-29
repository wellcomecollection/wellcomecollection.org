import { storiesOf } from '@storybook/react';
import SearchTabs from '../../../common/views/components/SearchTabs/SearchTabs';
import Readme from '../../../common/views/components/SearchTabs/README.md';

const SearchTabsExample = () => {
  return <SearchTabs />;
};

const stories = storiesOf('Components', module);

stories.add('SearchTabs', SearchTabsExample, {
  isFullScreen: true,
  readme: { sidebar: Readme },
});
