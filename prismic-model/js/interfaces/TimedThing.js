// @flow
import timestamp from '../parts/timestamp';
// import link from '../parts/link';
import list from '../parts/list';
import boolean from '../parts/boolean';

const TimedThing = {
  Times: {
    times: list('Times', {
      start: timestamp('Start'),
      end: timestamp('End'),
      // Maybe this is a list of statuses?
      // e.g. fully booked, relaxed performance etc.
      isFullyBooked: boolean('Fully booked'),
      isRelaxedPerformance: boolean('Relaxed performance'),
      // interpretations: list('Interpretations', {
      //   interpretation: link('Interpretation', 'document', ['interpretation']),
      //   isPrimary: boolean('Primary interprtation'),
      // }),
    }),
  },
};

export default TimedThing;
