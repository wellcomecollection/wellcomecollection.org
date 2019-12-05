import { storiesOf } from '@storybook/react';
import Select from '../../../common/views/components/Select/Select';
import Readme from '../../../common/views/components/Select/README.md';

const SelectExample = () => {
  return (
    <Select
      name="sortBy"
      label={`Sort by`}
      options={[
        { text: 'Relevance' },
        { text: 'Oldest to newest' },
        { text: 'Newest to oldest' },
      ]}
    />
  );
};

const stories = storiesOf('Components', module);
stories.add('Select', SelectExample, { readme: { sidebar: Readme } });
