import { storiesOf } from '@storybook/react';
import Contributors from '../../../common/views/components/Contributors/Contributors';
import ContributorsReadme from '../../../common/views/components/Contributors/README.md';

const stories = storiesOf('Components', module);
stories
  .add('Contributors', () => <Contributors contributors={[]} />, {
    info: ContributorsReadme
  });
