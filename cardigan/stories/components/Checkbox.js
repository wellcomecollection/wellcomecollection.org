import { storiesOf } from '@storybook/react';
import Checkbox from '../../../common/views/components/Checkbox/Checkbox';
import Readme from '../../../common/views/components/Checkbox/README.md';

const stories = storiesOf('Components', module);

stories.add('Checkbox', () => <Checkbox text="Manuscripts" />, {
  readme: { sidebar: Readme },
});
