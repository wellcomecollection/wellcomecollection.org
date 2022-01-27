import { FunctionComponent, Fragment } from 'react';
import { formatDay, formatDayMonth } from '@weco/common/utils/format-date';
import styled from 'styled-components';
import { Weight } from '@weco/common/services/prismic/parsers';
import { classNames, font } from '@weco/common/utils/classnames';
import MoreLink from '@weco/common/views/components/MoreLink/MoreLink';
import Icon from '@weco/common/views/components/Icon/Icon';
import Divider from '@weco/common/views/components/Divider/Divider';
import { UiImage } from '@weco/common/views/components/Images/Images';
import { clock } from '@weco/common/icons';
import {
  backfillExceptionalVenueDays,
  getUpcomingExceptionalPeriods,
  exceptionalOpeningDates,
  exceptionalOpeningPeriods,
  convertJsonDateStringsToMoment,
  exceptionalOpeningPeriodsAllDates,
  parseCollectionVenues,
} from '@weco/common/services/prismic/opening-times';
import Space from '@weco/common/views/components/styled/Space';
import { usePrismicData } from '@weco/common/server-data/Context';
import { Venue } from '@weco/common/model/opening-hours';

const VenueHoursImage = styled(Space)`
  ${props => props.theme.media.medium`
    width: 50%;
  `}
  ${props => props.theme.media.large`
    float: left;
    width: 33%;
    padding-right: ${props => 5 * props.theme.spacingUnit}px;
  `}
`;

const VenueHoursTimes = styled(Space)`
  ${props => props.theme.media.medium`
    float: left;
    width:33%;
    min-width: 240px;
    padding-right: ${props => 5 * props.theme.spacingUnit}px;
  `}
`;

type JauntyBoxProps = {
  topLeft: string;
  topRight: string;
  bottomLeft: string;
  bottomRight: string;
};
const JauntyBox = styled(Space).attrs(() => ({
  className: classNames({
    'bg-yellow inline-block': true,
  }),
}))<JauntyBoxProps>`
  padding-left: 30px;
  padding-right: 42px;
  margin-left: -12px;
  margin-right: -12px;

  ${props => props.theme.media.medium`
    margin-left: -24px;
    margin-right: -24px;
  `}
  clip-path: ${({ topLeft, topRight, bottomRight, bottomLeft }) =>
    `polygon(
      ${topLeft} ${topLeft},
      calc(100% - ${topRight}) ${topRight},
      100% calc(100% - ${bottomRight}),
      ${bottomLeft} 100%
    )`};
`;

const randomPx = () => `${Math.floor(Math.random() * 20)}px`;

type Props = {
  venue: Venue;
  weight: Weight;
};

const VenueHours: FunctionComponent<Props> = ({ venue, weight }) => {
  const { collectionVenues } = usePrismicData();
  const venues = parseCollectionVenues(collectionVenues);
  const allExceptionalDates = exceptionalOpeningDates(venues);
  const groupedExceptionalDates =
    exceptionalOpeningPeriods(allExceptionalDates);
  const exceptionalPeriodsAllDates = exceptionalOpeningPeriodsAllDates(
    groupedExceptionalDates
  );
  const backfilledExceptionalPeriods = venue
    ? backfillExceptionalVenueDays(
        convertJsonDateStringsToMoment(venue),
        exceptionalPeriodsAllDates
      )
    : [];
  const upcomingExceptionalPeriods =
    backfilledExceptionalPeriods &&
    getUpcomingExceptionalPeriods(backfilledExceptionalPeriods);

  const isFeatured = weight === 'featured';
  return (
    <>
      {isFeatured && (
        <>
          <Space v={{ size: 'l', properties: ['margin-bottom'] }}>
            <span className="is-hidden-s">
              <Divider color={`pumice`} isKeyline={true} />
            </span>
          </Space>
          <VenueHoursImage v={{ size: 'm', properties: ['margin-bottom'] }}>
            {venue?.image?.url && (
              <UiImage
                contentUrl={venue.image.url}
                width={1600}
                height={900}
                crops={{}}
                alt={venue.image?.alt}
                sizesQueries="(min-width: 1340px) 303px, (min-width: 960px) calc(30.28vw - 68px), (min-width: 600px) calc(50vw - 42px), calc(100vw - 36px)"
                extraClasses=""
                showTasl={false}
              />
            )}
          </VenueHoursImage>
        </>
      )}
      <VenueHoursTimes v={{ size: 'm', properties: ['margin-bottom'] }}>
        <Space
          as="h2"
          h={{ size: 'm', properties: ['padding-right'] }}
          className={classNames({
            h2: true,
          })}
        >
          {isFeatured && venue?.name ? venue.name : 'Opening hours'}
        </Space>
        <ul
          className={classNames({
            'plain-list no-padding no-margin': true,
            [font('hnr', 5)]: true,
          })}
        >
          {venue?.openingHours.regular.map(
            ({ dayOfWeek, opens, closes, isClosed }) => (
              <li key={dayOfWeek}>
                {dayOfWeek} {isClosed ? 'Closed' : `${opens}—${closes}`}
              </li>
            )
          )}
        </ul>
      </VenueHoursTimes>
      {upcomingExceptionalPeriods.map((upcomingExceptionalPeriod, i) => {
        const firstOverride = upcomingExceptionalPeriod.find(
          date => date.overrideType
        );
        const overrideType =
          firstOverride && firstOverride.overrideType === 'other'
            ? 'Unusual'
            : firstOverride && firstOverride.overrideType;
        return (
          <Fragment key={`JauntyBox-${i}`}>
            <JauntyBox
              v={{
                size: 'l',
                properties: ['padding-top', 'padding-bottom'],
              }}
              topLeft={randomPx()}
              topRight={randomPx()}
              bottomRight={randomPx()}
              bottomLeft={randomPx()}
            >
              <h3
                className={classNames({
                  [font('hnb', 5)]: true,
                })}
              >
                <div
                  className={classNames({
                    'flex flex--v-center': true,
                  })}
                >
                  <Space
                    as="span"
                    h={{ size: 's', properties: ['margin-right'] }}
                  >
                    <Icon icon={clock} />
                  </Space>
                  <span>{overrideType} hours</span>
                </div>
              </h3>
              <ul
                className={classNames({
                  'plain-list no-padding no-margin': true,
                  [font('hnr', 5)]: true,
                })}
              >
                {upcomingExceptionalPeriod.map(p => (
                  <li key={p.overrideDate?.toString()}>
                    {p.overrideDate && formatDay(p.overrideDate.toDate())}{' '}
                    {p.overrideDate && formatDayMonth(p.overrideDate.toDate())}{' '}
                    {p.isClosed ? 'Closed' : `${p.opens}—${p.closes}`}
                  </li>
                ))}
              </ul>
            </JauntyBox>
            <br />
          </Fragment>
        );
      })}
      <Space
        v={{
          size: 's',
          properties: ['margin-top'],
        }}
        style={{ clear: 'both' }}
      >
        {isFeatured && venue?.linkText && venue?.url && (
          <MoreLink url={venue?.url} name={venue?.linkText} />
        )}
      </Space>
    </>
  );
};

export default VenueHours;
