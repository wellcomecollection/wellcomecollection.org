import { storiesOf } from '@storybook/react';
import VenueHours from '../../../common/views/components/VenueHours/VenueHours';
import Readme from '../../../common/views/components/VenueHours/README.md';

const stories = storiesOf('Components', module);

const VenueHoursExample = () => {
  return <VenueHours />;
};

stories.add('VenueHours', VenueHoursExample, {
  info: Readme,
  isFullScreen: true,
});
