import { storiesOf } from '@storybook/react';
import VenueHours from '../../../common/views/components/VenueHours/VenueHours';
import Readme from '../../../common/views/components/VenueHours/README.md';
import { ThemeProvider } from 'styled-components';
import theme from '../../../common/views/themes/default';

const stories = storiesOf('Components', module);

const VenueHoursExample = () => {
  return (
    <ThemeProvider theme={theme}>
      <VenueHours />
    </ThemeProvider>
  );
};

stories.add('VenueHours', VenueHoursExample, {
  info: Readme,
  isFullScreen: true,
});
