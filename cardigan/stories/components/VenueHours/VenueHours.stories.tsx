import { Meta, StoryObj } from '@storybook/react';
import { useEffect, useState } from 'react';

import { ReadmeDecorator } from '@weco/cardigan/config/decorators';
import { Venue } from '@weco/common/model/opening-hours';
import { galleriesVenue } from '@weco/common/test/fixtures/components/galleries-venue';
import VenueHours from '@weco/content/views/components/VenueHours';
import Readme from '@weco/content/views/components/VenueHours/README.mdx';

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

const meta: Meta<typeof VenueHours> = {
  title: 'Components/VenueHours/VenueHours',
  component: VenueHours,
  args: {
    venue: galleriesVenue,
  },
  argTypes: {
    venue: {
      table: { disable: true },
    },
  },
};

export default meta;

type Story = StoryObj<typeof VenueHours>;

export const Basic: Story = {
  name: 'VenueHours',
  render: Template,
};
