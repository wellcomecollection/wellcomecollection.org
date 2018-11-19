import { storiesOf } from '@storybook/react';
import SearchBox from '../../../common/views/components/SearchBox/SearchBox';
import Readme from '../../../common/views/components/SearchBox/README.md';

const SearchBoxExample = () => {
  return <SearchBox />;
};

const stories = storiesOf('Components', module);
stories
  .add('SearchBox', SearchBoxExample, {info: Readme});
