import { storiesOf } from '@storybook/react';
import Footer from '../../../common/views/components/Footer/Footer';
import Readme from '../../../common/views/components/Footer/README.md';
import {groupedVenues, upcomingExceptionalOpeningPeriods} from '../opening-times';
import { boolean } from '@storybook/addon-knobs/react';

const FooterExample = () => {
  const hasUpcomingExceptionalOpening = boolean('Has upcoming exceptional opening hours', false);
  return  (
    <Footer
      openingHoursId='footer'
      groupedVenues={groupedVenues}
      upcomingExceptionalOpeningPeriods={hasUpcomingExceptionalOpening ? upcomingExceptionalOpeningPeriods : undefined} />
  );
};

const stories = storiesOf('Components', module);
stories
  .add('Footer', FooterExample, {info: Readme});
