import { storiesOf } from '@storybook/react';
import DropdownButton from '../../../common/views/components/DropdownButton/DropdownButton';
import Readme from '../../../common/views/components/DropdownButton/README.md';

const DropdownButtonExample = () => {
  return <DropdownButton />;
};

const stories = storiesOf('Components', module);
stories.add('DropdownButton', DropdownButtonExample, {
  readme: { sidebar: Readme },
});
