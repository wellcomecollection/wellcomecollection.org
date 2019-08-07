import { type Weight } from '@weco/common/services/prismic/parsers';
import { useContext, type ComponentType } from 'react';
import { classNames, font } from '@weco/common/utils/classnames';
import { formatDay, formatDayMonth } from '@weco/common/utils/format-date';
import styled from 'styled-components';
import MoreLink from '@weco/common/views/components/MoreLink/MoreLink';
import Icon from '@weco/common/views/components/Icon/Icon';
import Divider from '@weco/common/views/components/Divider/Divider';
import { UiImage } from '@weco/common/views/components/Images/Images';
import {
  backfillExceptionalVenueDays,
  getUpcomingExceptionalPeriods,
  getExceptionalOpeningPeriods,
  convertJsonDateStringsToMoment,
} from '../../../services/prismic/opening-times';
import OpeningTimesContext from '@weco/common/views/components/OpeningTimesContext/OpeningTimesContext';
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

  const venueAdditionalInfo = {
    galleries: {
      image:
        'https://iiif.wellcomecollection.org/image/prismic:05eae23ee0eada0bf4d025d999dfd100c05feeb1_c0108491.jpg',
      displayTitle: 'Galleries and Reading Room',
      linkText: `See what's on`,
      url: '/whats-on',
    },
    library: {
      image:
        'https://iiif.wellcomecollection.org/image/prismic:36a2f85c1f1b6fb180c87ea8fadc67035bcc7eeb_c0112117.jpg',
      displayTitle: 'Library',
      linkText: 'Read about the library',
      url: '/pages/Wuw19yIAAK1Z3Smm',
    },
    shop: {
      image:
        'https://iiif.wellcomecollection.org/image/prismic:bcdceabe08cf8b0a3a9facdfc5964d3cf968e38c_c0144444.jpg',
      displayTitle: 'Wellcome Shop',
      linkText: 'Books and gifts',
      url: '/pages/WwgaIh8AAB8AGhC_',
    },
    café: {
      image:
        'https://iiif.wellcomecollection.org/image/prismic:59cf3a27d3e6e0dc210b68d0d29c03cc34b9ee8d_c0144277.jpg',
      displayTitle: 'Wellcome Café',
      linkText: 'Take a break in our café',
      url: '/pages/Wvl1wiAAADMJ3zNe',
    },
    restaurant: {
      image:
        'https://iiif.wellcomecollection.org/image/prismic:97017f7ca01717f1ca469a08b510f9a5af6a1d43_c0146591_large.jpg',
      displayTitle: 'Wellcome Kitchen',
      linkText: 'Explore the menus',
      url: '/pages/Wuw19yIAAK1Z3Snk',
    },
  };

  return (
    <>
      {weight === 'featured' && (
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
            <UiImage
              contentUrl={venueAdditionalInfo[venue.name.toLowerCase()].image}
              width={1600}
              height={900}
              alt=""
              tasl={null}
              sizesQueries="(min-width: 1340px) 303px, (min-width: 960px) calc(30.28vw - 68px), (min-width: 600px) calc(50vw - 42px), calc(100vw - 36px)"
              extraClasses=""
              showTasl={false}
            />
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
          {weight === 'featured'
            ? `${venueAdditionalInfo[venue.name.toLowerCase()].displayTitle}`
            : 'Opening hours'}
        </Space>
        <ul
          className={classNames({
            'plain-list no-padding no-margin': true,
            [font('hnl', 5)]: true,
          })}
        >
          {venue.openingHours.regular.map(({ dayOfWeek, opens, closes }) => (
            <li key={dayOfWeek}>
              {dayOfWeek} {opens ? `${opens}—${closes}` : 'Closed'}
            </li>
          ))}
        </ul>
      </VenueHoursTimes>
      {upcomingExceptionalPeriods.map(upcomingExceptionalPeriod => {
        const firstOverride = upcomingExceptionalPeriod.find(
          date => date.overrideType
        );
        const overrideType =
          firstOverride && firstOverride.overrideType === 'other'
            ? 'Unusual'
            : firstOverride.overrideType;
        return (
          <>
            <JauntyBox
              v={{
                size: 'l',
                properties: ['padding-top', 'padding-bottom'],
              }}
              key={upcomingExceptionalPeriod}
              topLeft={randomPx()}
              topRight={randomPx()}
              bottomRight={randomPx()}
              bottomLeft={randomPx()}
            >
              <h3
                className={classNames({
                  [font('hnm', 5)]: true,
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
                  [font('hnl', 5)]: true,
                })}
              >
                {upcomingExceptionalPeriod.map(p => (
                  <li key={p.overrideDate}>
                    {formatDay(p.overrideDate)} {formatDayMonth(p.overrideDate)}{' '}
                    {p.opens ? `${p.opens}—${p.closes}` : 'Closed'}
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
        {weight === 'featured' ? (
          <MoreLink
            url={venueAdditionalInfo[venue.name.toLowerCase()].url}
            name={venueAdditionalInfo[venue.name.toLowerCase()].linkText}
          />
        ) : (
          <MoreLink url={'/opening-times'} name="See all opening times" />
        )}
      </Space>
    </>
  );
};

export default VenueHours;
