import { storiesOf } from '@storybook/react';
import Map from '../../../common/views/components/Map/Map';
import Readme from '../../../common/views/components/Map/README.md';
import { ThemeProvider } from 'styled-components';
import theme from '../../../common/views/themes/default';

const stories = storiesOf('Components', module);

stories.add(
  'Map',
  () => (
    <ThemeProvider theme={theme}>
      <Map title={'Cardy map'} latitude={51.526053} longitude={-0.1333271} />
    </ThemeProvider>
  ),
  {
    readme: { sidebar: Readme },
  }
);
