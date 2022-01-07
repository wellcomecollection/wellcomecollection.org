import VenueHours from '@weco/content/components/VenueHours/VenueHours';
import { galleriesVenue } from '@weco/common/test/fixtures/components/galleries-venue';

const Template = () => {
  return <VenueHours venueId={galleriesVenue.id} weight="featured" />;
};
export const basic = Template.bind({});

basic.storyName = 'VenueHours';
