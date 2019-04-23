import { useContext } from 'react';
import { classNames, font, spacing } from '@weco/common/utils/classnames';
import { formatDay, formatDayMonth } from '@weco/common/utils/format-date';
import styled from 'styled-components';
import MoreLink from '@weco/common/views/components/MoreLink/MoreLink';
import Icon from '@weco/common/views/components/Icon/Icon';
import Divider from '@weco/common/views/components/Divider/Divider';
import { UiImage } from '@weco/common/views/components/Images/Images';
import {
  backfillExceptionalVenueDays,
  getUpcomingExceptionalPeriod,
  getExceptionalOpeningPeriods,
  convertJsonDateStringsToMoment,
} from '../../../services/prismic/opening-times';
import OpeningTimesContext from '@weco/common/views/components/OpeningTimesContext/OpeningTimesContext';

const VenueHoursImage = styled.div.attrs(props => ({
  className: classNames({
    [spacing({ s: 2 }, { margin: ['bottom'] })]: true,
  }),
}))`
  ${props => props.theme.media.medium`
    width: 50%;
    `}
  ${props => props.theme.media.large`
    float: left;
    width: 33%;
    padding-right: ${props => 5 * props.theme.spacingUnit}px;
  `}
`;

const VenueHoursTimes = styled.div.attrs(props => ({
  className: classNames({
    [spacing({ s: 2 }, { margin: ['bottom'] })]: true,
  }),
}))`
  ${props => props.theme.media.medium`
    float: left;
    width:33%;
    min-width: 240px;
    padding-right: ${props => 5 * props.theme.spacingUnit}px;
    `}
`;

const JauntyBox = styled.div.attrs(props => ({
  className: classNames({
    'bg-yellow inline-block': true,
    [spacing({ s: 4 }, { padding: ['top', 'bottom'] })]: true,
    [spacing({ s: 5 }, { padding: ['left'] })]: true,
    [spacing({ s: 7 }, { padding: ['right'] })]: true,
    [spacing({ s: -2, m: -4 }, { margin: ['left', 'right'] })]: true,
  }),
}))`
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
  isInList: boolean,
|};

const VenueHours = ({ venue, isInList }: Props) => {
  const openingTimes = useContext(OpeningTimesContext);
  const exceptionalPeriods = getExceptionalOpeningPeriods(openingTimes);
  const backfilledExceptionalPeriods = backfillExceptionalVenueDays(
    convertJsonDateStringsToMoment(venue),
    exceptionalPeriods
  );
  const upcomingExceptionalPeriod =
    backfilledExceptionalPeriods &&
    getUpcomingExceptionalPeriod(backfilledExceptionalPeriods);

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
      {isInList && (
        <>
          <Divider
            extraClasses={classNames({
              'divider--keyline': true,
              'divider--pumice': true,
              'is-hidden-s': true,
              [spacing({ s: 4 }, { margin: ['bottom'] })]: true,
            })}
          />
          <VenueHoursImage>
            <UiImage
              contentUrl={venueAdditionalInfo[venue.name.toLowerCase()].image}
              width={1600}
              height={900}
              alt=""
              tasl={null}
              sizesQueries={null}
              extraClasses=""
              showTasl={false}
            />
          </VenueHoursImage>
        </>
      )}
      <VenueHoursTimes>
        <h2
          className={classNames({
            h2: true,
            [spacing({ s: 2 }, { padding: ['right'] })]: true,
          })}
        >
          {isInList
            ? `${venueAdditionalInfo[venue.name.toLowerCase()].displayTitle}`
            : 'Opening hours'}
        </h2>
        <ul
          className={classNames({
            'plain-list no-padding no-margin': true,
            [font({ s: 'HNL4' })]: true,
          })}
        >
          {venue.openingHours.regular.map(({ dayOfWeek, opens, closes }) => (
            <li key={dayOfWeek}>
              {dayOfWeek} {opens ? `${opens}—${closes}` : 'Closed'}
            </li>
          ))}
        </ul>
      </VenueHoursTimes>
      {upcomingExceptionalPeriod && upcomingExceptionalPeriod.length > 0 && (
        <JauntyBox
          topLeft={randomPx()}
          topRight={randomPx()}
          bottomRight={randomPx()}
          bottomLeft={randomPx()}
        >
          <h3
            className={classNames({
              [font({ s: 'HNM4' })]: true,
            })}
          >
            <div
              className={classNames({
                'flex flex--v-center': true,
              })}
            >
              <Icon
                name="clock"
                extraClasses={classNames({
                  [spacing({ s: 1 }, { margin: ['right'] })]: true,
                })}
              />
              <span>{upcomingExceptionalPeriod[0][0].overrideType} hours</span>
            </div>
          </h3>
          <ul
            className={classNames({
              'plain-list no-padding no-margin': true,
              [font({ s: 'HNL4' })]: true,
            })}
          >
            {upcomingExceptionalPeriod[0].map((p, i) => (
              <li key={i}>
                {formatDay(p.overrideDate)} {formatDayMonth(p.overrideDate)}{' '}
                {p.opens ? `${p.opens}—${p.closes}` : 'Closed'}
              </li>
            ))}
          </ul>
        </JauntyBox>
      )}
      <div
        className={classNames({
          [spacing({ s: 2 }, { margin: ['top'] })]: true,
        })}
        style={{ clear: 'both' }}
      >
        {isInList ? (
          <MoreLink
            url={venueAdditionalInfo[venue.name.toLowerCase()].url}
            name={venueAdditionalInfo[venue.name.toLowerCase()].linkText}
          />
        ) : (
          <MoreLink url={'/opening-times'} name="See all opening times" />
        )}
      </div>
    </>
  );
};

export default VenueHours;
