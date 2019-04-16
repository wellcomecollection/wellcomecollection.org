import { storiesOf } from '@storybook/react';
import BetaMessage from '../../../common/views/components/BetaMessage/BetaMessage';
import Readme from '../../../common/views/components/BetaMessage/README.md';
import { ThemeProvider } from 'styled-components';
import theme from '../../../common/views/themes/default';

const stories = storiesOf('Components', module);

stories.add(
  'BetaMessage',
  () => (
    <ThemeProvider theme={theme}>
      <BetaMessage message="We are working to make this item available online in April 2019." />
    </ThemeProvider>
  ),
  {
    info: Readme,
  }
);
