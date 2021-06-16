// @flow
import { type Weight } from '@weco/common/services/prismic/parsers';
import { useContext, type ComponentType } from 'react';
import { classNames, font } from '@weco/common/utils/classnames';
import { formatDay, formatDayMonth } from '@weco/common/utils/format-date';
import styled from 'styled-components';
// $FlowFixMe (tsx)
import MoreLink from '@weco/common/views/components/MoreLink/MoreLink';
// $FlowFixMe (tsx)
import Icon from '@weco/common/views/components/Icon/Icon';
// $FlowFixMe(tsx)
import Divider from '@weco/common/views/components/Divider/Divider';
import { UiImage } from '@weco/common/views/components/Images/Images';
import {
  backfillExceptionalVenueDays,
  getUpcomingExceptionalPeriods,
  getExceptionalOpeningPeriods,
  convertJsonDateStringsToMoment,
} from '../../../services/prismic/opening-times';
// $FlowFixMe (tsx)
import OpeningTimesContext from '@weco/common/views/components/OpeningTimesContext/OpeningTimesContext';
// $FlowFixMe (tsx)
import Space, { type SpaceComponentProps } from '../styled/Space';

const VenueHoursImage: ComponentType<SpaceComponentProps> = styled(Space)`
  ${props => props.theme.media.medium`
    width: 50%;
  `}
  ${props => props.theme.media.large`
    float: left;
    width: 33%;
    padding-right: ${props => 5 * props.theme.spacingUnit}px;
  `}
`;

const VenueHoursTimes: ComponentType<SpaceComponentProps> = styled(Space)`
  ${props => props.theme.media.medium`
    float: left;
    width:33%;
    min-width: 240px;
    padding-right: ${props => 5 * props.theme.spacingUnit}px;
  `}
`;

const JauntyBox: ComponentType<SpaceComponentProps> = styled(Space).attrs(
  props => ({
    className: classNames({
      'bg-yellow inline-block': true,
    }),
  })
)`
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

type Props = {|
  venue: any, // FIXME: Flow
  weight: Weight,
|};

const VenueHours = ({ venue, weight }: Props) => {
  const openingTimes = useContext(OpeningTimesContext);
  const exceptionalPeriods = getExceptionalOpeningPeriods(openingTimes);
  const backfilledExceptionalPeriods = backfillExceptionalVenueDays(
    convertJsonDateStringsToMoment(venue),
    exceptionalPeriods
  );
  const upcomingExceptionalPeriods =
    backfilledExceptionalPeriods &&
    getUpcomingExceptionalPeriods(backfilledExceptionalPeriods);

  const isFeatured = weight === 'featured';
  return (
    <>
      {isFeatured && (
        <>
          <Space v={{ size: 'l', properties: ['margin-bottom'] }}>
            <Divider
              extraClasses={classNames({
                'divider--keyline': true,
                'divider--pumice': true,
                'is-hidden-s': true,
              })}
            />
          </Space>
          <VenueHoursImage v={{ size: 'm', properties: ['margin-bottom'] }} s>
            {venue.image && venue.image?.url && (
              <UiImage
                contentUrl={venue.image.url}
                width={1600}
                height={900}
                crops={{}}
                alt={venue.image?.alt}
                tasl={{
                  title: null,
                  author: null,
                  sourceName: null,
                  sourceLink: null,
                  license: null,
                  copyrightHolder: null,
                  copyrightLink: null,
                }}
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
          {isFeatured && venue.name ? venue.name : 'Opening hours'}
        </Space>
        <ul
          className={classNames({
            'plain-list no-padding no-margin': true,
            [font('hnr', 5)]: true,
          })}
        >
          {venue.openingHours.regular.map(({ dayOfWeek, opens, closes }) => (
            <li key={dayOfWeek}>
              {dayOfWeek} {opens ? `${opens}—${closes}` : 'Closed'}
            </li>
          ))}
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
          <>
            <JauntyBox
              v={{
                size: 'l',
                properties: ['padding-top', 'padding-bottom'],
              }}
              key={i}
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
                    <Icon name="clock" />
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
                  <li key={p.overrideDate.toString()}>
                    {formatDay(p.overrideDate.toDate())}{' '}
                    {formatDayMonth(p.overrideDate.toDate())}{' '}
                    {p.opens && p.closes ? `${p.opens}—${p.closes}` : 'Closed'}
                  </li>
                ))}
              </ul>
            </JauntyBox>
            <br />
          </>
        );
      })}
      <Space
        v={{
          size: 's',
          properties: ['margin-top'],
        }}
        style={{ clear: 'both' }}
      >
        {isFeatured && venue.linkText && venue.url && (
          <MoreLink url={venue.url} name={venue.linkText} />
        )}
      </Space>
    </>
  );
};

export default VenueHours;
