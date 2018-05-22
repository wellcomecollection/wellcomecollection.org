import { storiesOf } from '@storybook/react';
import { text, boolean } from '@storybook/addon-knobs/react';

import BasicPage from '../../common/views/components/Templates/BasicPage/BasicPage';
import StatusIndicator from '../../common/views/components/StatusIndicator/StatusIndicator';
import WobblyBackground from '../../common/views/components/Templates/BasicPage/WobblyBackground';
import DateRange from '../../common/views/components/DateRange/DateRange';

const basicPage = storiesOf('Templates/Basic page', module);

basicPage
  .add('without an image', () => {
    const pageTitle = text('Page title', 'This can be a title of some type of length');
    const pageDescription = text('Page description', 'The description of the pages, again, of varying length');
    const hasBackground = boolean('Has background?', true);
    const hasDescription = boolean('Has description?', true);
    const hasDateInfo = boolean('Has date info?', true);
    const hasInfoBar = boolean('Has info bar?', true);

    return (<BasicPage
      Background={
        hasBackground
          ? WobblyBackground()
          : null
      }
      title={pageTitle}
      body={[]}
      DateInfo={
        hasDateInfo
          ? <DateRange start={new Date()} end={new Date()} />
          : null
      }
      Description={
        hasDescription
          ? <div>{pageDescription}</div>
          : null
      }
      InfoBar={
        hasInfoBar
          ? <StatusIndicator start={new Date()} end={new Date()} />
          : null
      } />);
  });
