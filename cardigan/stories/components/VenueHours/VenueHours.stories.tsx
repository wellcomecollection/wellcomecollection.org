import VenueHours from '@weco/common/views/components/VenueHours/VenueHours';
import OpeningTimesContext from '@weco/common/views/components/OpeningTimesContext/OpeningTimesContext';
import { openingTimes } from '../../content';

const now = new Date();
const threeDaysFromNow = new Date();
threeDaysFromNow.setHours(now.getHours() + 72);

const venueMap = {
  Galleries: 0,
  Library: 1,
  Restaurant: 2,
  Cafe: 3,
  Shop: 4,
};

const Template = args => {
  const venueIndex = 'Galleries';

  const venue =
    openingTimes.collectionOpeningTimes.placesOpeningHours[
      venueMap[venueIndex]
    ];

  const hasExceptionalHours = false;

  const dummyOverrides = openingTimes.collectionOpeningTimes.placesOpeningHours.map(
    p => {
      return {
        ...p,
        openingHours: {
          ...p.openingHours,
          exceptional: hasExceptionalHours
            ? [
                {
                  overrideDate: now,
                  overrideType: 'Cardy test',
                  opens: '10:00',
                  closes: '18:00',
                },
                {
                  overrideDate: threeDaysFromNow,
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

  const venueWithImages = {
    ...venue,
    image: {
      url:
        'https://images.prismic.io/wellcomecollection%2Fafc7db83-af2e-4108-a050-27f391b8c7f2_c0108492.jpg?auto=compress,format',
      alt: 'Photograph of the Reading Room at Wellcome Collection.',
    },
    linkText: `See what's on`,
    url: 'https://wellcomecollection.org/whats-on',
  };

  return (
    <OpeningTimesContext.Provider value={dummyOpeningTimes}>
      <VenueHours
        venue={venueWithImages}
        weight="featured"
        isInList={args.isInList}
      />
    </OpeningTimesContext.Provider>
  );
};
export const basic = Template.bind({});
basic.args = {
  isInList: false,
};
basic.storyName = 'VenueHours';
