import moment from 'moment';
import { storiesOf } from '@storybook/react';
import VenueHours from '../../../common/views/components/VenueHours/VenueHours';
import Readme from '../../../common/views/components/VenueHours/README.md';
import { openingTimes } from '../content';
import OpeningTimesContext from '../../../common/views/components/OpeningTimesContext/OpeningTimesContext';
import { select, boolean } from '@storybook/addon-knobs/react';

const venueMap = {
  Galleries: 0,
  Library: 1,
  Restaurant: 2,
  Cafe: 3,
  Shop: 4,
};

const stories = storiesOf('Components', module);

const VenueHoursExample = () => {
  const venueIndex = select(
    'Venue',
    ['Galleries', 'Library', 'Restaurant', 'Cafe', 'Shop'],
    'Galleries'
  );

  const venue =
    openingTimes.collectionOpeningTimes.placesOpeningHours[
      venueMap[venueIndex]
    ];

  const hasExceptionalHours = boolean('Has exceptional upcoming hours?', false);

  const dummyOverrides = openingTimes.collectionOpeningTimes.placesOpeningHours.map(
    p => {
      return {
        ...p,
        openingHours: {
          ...p.openingHours,
          exceptional: hasExceptionalHours
            ? [
                {
                  overrideDate: moment(),
                  overrideType: 'Cardy test',
                  opens: '10:00',
                  closes: '18:00',
                },
                {
                  overrideDate: moment().add(3, 'days'),
                  overrideType: 'Cardy test',
                  opens: '10:00',
                  closes: '18:00',
                },
              ]
            : [],
        },
      };
    }
  );

  const dummyOpeningTimes = {
    ...openingTimes,
    collectionOpeningTimes: {
      placesOpeningHours: dummyOverrides,
    },
  };

  return (
    <OpeningTimesContext.Provider value={dummyOpeningTimes}>
      <VenueHours venue={venue} isInList={boolean('Is in list?', false)} />
    </OpeningTimesContext.Provider>
  );
};

stories.add('VenueHours', VenueHoursExample, {
  info: Readme,
});
