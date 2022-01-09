import VenueClosedPeriods from '@weco/content/components/VenueClosedPeriods/VenueClosedPeriods';
import { galleriesVenue } from '@weco/common/test/fixtures/components/galleries-venue';

const Template = () => {
  return <VenueClosedPeriods venue={galleriesVenue} />;
};
export const basic = Template.bind({});

basic.storyName = 'VenueClosedPeriods';
