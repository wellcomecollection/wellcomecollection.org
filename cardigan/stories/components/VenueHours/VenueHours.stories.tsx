import VenueHours from '@weco/content/components/VenueHours/VenueHours';
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

const Template = () => {
  const venueIndex = 'Galleries';

  const venue = openingTimes.placesOpeningHours[venueMap[venueIndex]];

  const venueWithImages = {
    ...venue,
    image: {
      url: 'https://images.prismic.io/wellcomecollection%2Fafc7db83-af2e-4108-a050-27f391b8c7f2_c0108492.jpg?auto=compress,format',
      alt: 'Photograph of the Reading Room at Wellcome Collection.',
    },
    linkText: `See what's on`,
    url: 'https://wellcomecollection.org/whats-on',
  };

  return <VenueHours venue={venueWithImages} weight="featured" />;
};
export const basic = Template.bind({});

basic.storyName = 'VenueHours';
