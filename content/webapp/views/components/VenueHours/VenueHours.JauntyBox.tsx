import { clock } from '@weco/common/icons';
import {
  ExceptionalOpeningHoursDay,
  Venue,
} from '@weco/common/model/opening-hours';
import { font } from '@weco/common/utils/classnames';
import { formatDayName } from '@weco/common/utils/format-date';
import Icon from '@weco/common/views/components/Icon';
import Space from '@weco/common/views/components/styled/Space';

import { JauntyBox, OpeningHours } from './VenueHours.styles';
import UnusualOpeningHours from './VenueHours.UnusualOpeningHours';

const randomPx = () => `${Math.floor(Math.random() * 20)}px`;

const VenueHoursJauntyBox = ({
  upcomingExceptionalPeriod,
  venue,
}: {
  upcomingExceptionalPeriod: ExceptionalOpeningHoursDay[];
  venue: Venue;
}) => {
  const firstOverride = upcomingExceptionalPeriod.find(
    date => date.overrideType
  );

  const overrideType =
    firstOverride && firstOverride.overrideType === 'other'
      ? 'Unusual'
      : firstOverride && firstOverride.overrideType;

  return (
    <JauntyBox
      $v={{
        size: 'l',
        properties: ['padding-top', 'padding-bottom', 'margin-bottom'],
      }}
      $topLeft={randomPx()}
      $topRight={randomPx()}
      $bottomRight={randomPx()}
      $bottomLeft={randomPx()}
    >
      <h3 className={font('sans-bold', -1)}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Space as="span" $h={{ size: 's', properties: ['margin-right'] }}>
            <Icon icon={clock} />
          </Space>
          <span>{overrideType} hours</span>
        </div>
      </h3>

      <OpeningHours>
        {/*
          This will format the date of the exception as e.g. 'Saturday 1 October'.

          The year is omitted because these periods are only displayed when they're
          happening imminently (within a few weeks), and so the year is unambiguous.
        */}
        {upcomingExceptionalPeriod.map(exceptional => {
          // We have regular opening hours for each day of the week, so we'll
          // always find something here.
          const regular = venue.openingHours.regular
            .filter(
              ({ dayOfWeek }) =>
                dayOfWeek === formatDayName(exceptional.overrideDate)
            )
            .find(_ => _)!;

          return (
            <li key={exceptional.overrideDate.toString()}>
              <UnusualOpeningHours
                regular={regular}
                exceptional={exceptional}
              />
            </li>
          );
        })}
      </OpeningHours>
    </JauntyBox>
  );
};

export default VenueHoursJauntyBox;
