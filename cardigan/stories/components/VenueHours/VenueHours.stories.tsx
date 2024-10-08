import { useEffect, useState } from 'react';

import { ReadmeDecorator } from '@weco/cardigan/config/decorators';
import { Venue } from '@weco/common/model/opening-hours';
import { galleriesVenue } from '@weco/common/test/fixtures/components/galleries-venue';
import VenueHours from '@weco/content/components/VenueHours';
import Readme from '@weco/content/components/VenueHours/README.md';

// Won't display bank holidays as that requires a Prismic fetch, which doesn't work from Cardigan
const VenueHoursComponent = ({
  hasUnusualHours,
  venue,
}: {
  hasUnusualHours: boolean;
  venue: Venue;
}) => {
  const [completeVenue, setCompleteVenue] = useState(venue);
  const today = new Date();
  const tomorrow = new Date(today.getTime() + 1 * 24 * 60 * 60 * 1000);
  const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);

  useEffect(() => {
    if (hasUnusualHours) {
      setCompleteVenue({
        ...venue,
        openingHours: {
          ...venue.openingHours,
          exceptional: [
            ...venue.openingHours.exceptional,
            {
              overrideDate: tomorrow,
              overrideType: 'other',
              opens: '00:00',
              closes: '00:00',
              isClosed: true,
            },
            {
              overrideDate: nextWeek,
              overrideType: 'other',
              opens: '00:00',
              closes: '00:00',
              isClosed: true,
            },
            {
              overrideDate: today,
              overrideType: 'other',
              opens: '00:00',
              closes: '00:00',
              isClosed: true,
            },
          ],
        },
      });
    } else {
      setCompleteVenue(venue);
    }
  }, [hasUnusualHours]);

  return <VenueHours venue={completeVenue} />;
};

const Template = args => (
  <ReadmeDecorator
    WrappedComponent={VenueHoursComponent}
    args={args}
    Readme={Readme}
  />
);
export const basic = Template.bind({});
basic.args = {
  venue: galleriesVenue,
  hasUnusualHours: false,
};
basic.argTypes = {
  venue: {
    table: { disable: true },
  },
  hasUnusualHours: { control: 'boolean' },
};

basic.storyName = 'VenueHours';
