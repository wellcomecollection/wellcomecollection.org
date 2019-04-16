import { storiesOf } from '@storybook/react';
import ErrorPage from '../../../common/views/components/ErrorPage/ErrorPage';
import Readme from '../../../common/views/components/ErrorPage/README.md';
import GlobalAlertContext from '../../../common/views/components/GlobalAlertContext/GlobalAlertContext';
import OpeningTimesContext from '../../../common/views/components/OpeningTimesContext/OpeningTimesContext';
import { ThemeProvider } from 'styled-components';
import theme from '../../../common/views/themes/default';

import { openingTimes } from '../content';

const stories = storiesOf('Components', module);

stories.add(
  'ErrorPage',
  () => (
    <ThemeProvider theme={theme}>
      <OpeningTimesContext.Provider value={openingTimes}>
        <GlobalAlertContext.Provider value={''}>
          <ErrorPage statusCode={404} />
        </GlobalAlertContext.Provider>
      </OpeningTimesContext.Provider>
    </ThemeProvider>
  ),
  {
    info: Readme,
  }
);
