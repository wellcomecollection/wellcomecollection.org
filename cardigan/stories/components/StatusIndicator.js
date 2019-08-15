import { storiesOf } from '@storybook/react';
import moment from 'moment';
import StatusIndicator from '../../../common/views/components/StatusIndicator/StatusIndicator';
import Readme from '../../../common/views/components/StatusIndicator/README.md';
import { text, select } from '@storybook/addon-knobs/react';

const stories = storiesOf('Components', module);

const StatusIndicatorExample = () => {
  const status = select(
    'Status',
    ['Coming soon', 'Past', 'Final week', 'Now on'],
    'Now on'
  );
  const statusOverride = text('Status override', '');

  function getDatesForStatus() {
    switch (status) {
      case 'Coming soon':
        return {
          start: moment().add(1, 'day'),
          end: moment().add(2, 'week'),
        };

      case 'Past':
        return {
          start: moment().subtract(2, 'week'),
          end: moment().subtract(1, 'week'),
        };

      case 'Final week':
        return {
          start: moment(),
          end: moment().add(3, 'days'),
        };

      case 'Now on':
        return {
          start: moment(),
          end: moment().add(2, 'week'),
        };
    }
  }

  return (
    <StatusIndicator
      {...getDatesForStatus()}
      statusOverride={statusOverride.trim() !== '' ? statusOverride : null}
    />
  );
};

stories.add('StatusIndicator', StatusIndicatorExample, {
  readme: { sidebar: Readme },
});
