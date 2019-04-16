import { storiesOf } from '@storybook/react';
import Footer from '../../../common/views/components/Footer/Footer';
import Readme from '../../../common/views/components/Footer/README.md';
import { openingTimes } from '../content';
import { ThemeProvider } from 'styled-components';
import theme from '../../../common/views/themes/default';

const FooterExample = () => {
  return (
    <ThemeProvider theme={theme}>
      <Footer openingTimes={openingTimes} />
    </ThemeProvider>
  );
};

const stories = storiesOf('Components', module);
stories.add('Footer', FooterExample, { info: Readme, isFullScreen: true });
