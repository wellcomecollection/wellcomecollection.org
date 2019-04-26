import { storiesOf } from '@storybook/react';
import MoreLink from '../../../common/views/components/MoreLink/MoreLink';
import Readme from '../../../common/views/components/MoreLink/README.md';

const stories = storiesOf('Components', module);
stories.add(
  'MoreLink',
  () => <MoreLink url={`#`} name={`View all exhibitions`} />,
  { readme: { sidebar: Readme } }
);
