import { storiesOf } from '@storybook/react';
import BetaMessage from '../../../common/views/components/BetaMessage/BetaMessage';
import Readme from '../../../common/views/components/BetaMessage/README.md';

const stories = storiesOf('Components', module);

stories.add(
  'BetaMessage',
  () => (
    <BetaMessage message="We are working to make this item available online in July 2019." />
  ),
  {
    readme: { sidebar: Readme },
  }
);
