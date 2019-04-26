import { storiesOf } from '@storybook/react';
import MessageBar from '../../../common/views/components/MessageBar/MessageBar';
import Readme from '../../../common/views/components/MessageBar/README.md';

const stories = storiesOf('Components', module);

stories.add(
  'BetaBar',
  () => (
    <MessageBar tagText={'Smoke test'}>
      Things may not always be what they seem.
      <a href="/works/progress">Find out more</a>.
    </MessageBar>
  ),
  {
    readme: { sidebar: Readme },
  }
);
