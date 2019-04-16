import { storiesOf } from '@storybook/react';
import BetaBar from '../../../common/views/components/BetaBar/BetaBar';
import Readme from '../../../common/views/components/BetaBar/README.md';

const stories = storiesOf('Components', module);

stories.add('BetaBar', () => <BetaBar />, {
  info: Readme,
});
