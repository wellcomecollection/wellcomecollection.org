import { useContext } from 'react';
import { classNames, font, grid, spacing } from '@weco/common/utils/classnames';
import styled from 'styled-components';
import MoreLink from '@weco/common/views/components/Links/MoreLink/MoreLink';
import Icon from '@weco/common/views/components/Icon/Icon';
import Divider from '@weco/common/views/components/Divider/Divider';
import { UiImage } from '@weco/common/views/components/Images/Images';
import {
  backfillExceptionalVenueDays,
  getUpcomingExceptionalPeriod,
  exceptionalOpeningDates,
  exceptionalOpeningPeriods,
  exceptionalOpeningPeriodsAllDates,
} from '../../../services/prismic/opening-times';
import { formatDay, formatDayMonth } from '@weco/common/utils/format-date';
import OpeningTimesContext from '@weco/common/views/components/OpeningTimesContext/OpeningTimesContext';

const VenueHoursImage = styled.div.attrs(props => ({
  className: classNames({
    [grid({ s: 12, m: 6, l: 3, xl: 3, shiftL: 1, shiftXl: 2 })]: true,
    [spacing({ s: 2 }, { margin: ['bottom'] })]: true,
  }),
}))`
  @media (min-width: ${props =>
      props.theme.sizes.medium}px) and (max-width: ${props =>
      props.theme.sizes.large}px) {
    margin-right: 50%;
  }
`;

const JauntyBox = styled.div.attrs(props => ({
  className: classNames({
    'bg-yellow': true,
    [spacing({ s: 4 }, { padding: ['top', 'right', 'bottom', 'left'] })]: true,
    [spacing({ s: -2 }, { margin: ['left', 'right'] })]: true,
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
  // TODO names
  const a = exceptionalOpeningDates(openingTimes.collectionOpeningTimes);
  const b = a && exceptionalOpeningPeriods(a);
  const exceptionalPeriods = b && exceptionalOpeningPeriodsAllDates(b);
  const upcomingExceptionalPeriod = getUpcomingExceptionalPeriod(
    backfillExceptionalVenueDays(venue, exceptionalPeriods)
  );

  const venueAdditionalInfo = {
    galleries: {
      image:
        'https://iiif.wellcomecollection.org/image/prismic:f0d7c9fcc20dd187b7e656db616f7d228ffb5889_btg150421203820.jpg',
      displayTitle: 'Galleries and Reading Room',
      linkText: 'See all Exhibitions and events',
      url: '/whats-on',
    },
    library: {
      image:
        'https://iiif.wellcomecollection.org/image/prismic:36a2f85c1f1b6fb180c87ea8fadc67035bcc7eeb_c0112117.jpg',
      displayTitle: 'The Library',
      linkText: 'Read about our Library',
      url: '/pages/Wuw19yIAAK1Z3Smm',
    },
    shop: {
      image:
        'https://iiif.wellcomecollection.org/image/prismic:bcdceabe08cf8b0a3a9facdfc5964d3cf968e38c_c0144444.jpg',
      displayTitle: 'Wellcome Shop',
      linkText: 'Books and Gifts',
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
    <div className="row">
      <div className="container">
        <div className="grid">
          <div
            className={classNames({
              [spacing({ s: 4 }, { padding: ['bottom'] })]: true,
              [grid({
                s: 12,
                m: 12,
                l: 11,
                xl: 10,
                shiftL: 1,
                shiftXl: 2,
              })]: true,
              'is-hidden-s': true,
            })}
          >
            <Divider extraClasses="divider--keyline divider--pumice" />
          </div>
          <VenueHoursImage>
            {isInList && (
              <UiImage
                contentUrl={venueAdditionalInfo[venue.name.toLowerCase()].image}
                width={1600}
                height={900}
                alt="bill"
                tasl={null}
                sizesQueries={null}
                extraClasses=""
                showTasl={false}
              />
            )}
          </VenueHoursImage>
          <div
            className={classNames({
              [grid({ s: 12, m: 6, l: 3, xl: 3 })]: true,
              [spacing({ s: 2 }, { margin: ['bottom'] })]: true,
            })}
          >
            <h2 className="h2">
              {isInList
                ? `${
                    venueAdditionalInfo[venue.name.toLowerCase()].displayTitle
                  }`
                : 'Opening hours'}
            </h2>
            <ul
              className={classNames({
                'plain-list no-padding no-margin': true,
                [font({ s: 'HNL4' })]: true,
              })}
            >
              {venue.openingHours.regular.map(
                ({ dayOfWeek, opens, closes }) => (
                  <li key={dayOfWeek}>
                    {dayOfWeek} {opens ? `${opens}—${closes}` : 'Closed'}
                  </li>
                )
              )}
            </ul>
          </div>
          <div
            className={classNames({
              [grid({ s: 12, m: 6, l: 5, xl: 4 })]: true,
              [spacing({ s: 2 }, { margin: ['bottom'] })]: true,
            })}
          >
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
                    <span>
                      {/* TODO get this in a better way
                      `${upcomingExceptionalPeriod &&
                        upcomingExceptionalPeriod[0].find(
                          period => period.overrideType
                        ).overrideType} */}
                      hours
                    </span>
                  </div>
                </h3>
                <ul
                  className={classNames({
                    'plain-list no-padding no-margin': true,
                    [font({ s: 'HNL4' })]: true,
                  })}
                >
                  {upcomingExceptionalPeriod[0].map(p => (
                    <li key={p}>
                      {formatDay(p.overrideDate)}{' '}
                      {formatDayMonth(p.overrideDate)}{' '}
                      {p.opens ? `${p.opens}—${p.closes}` : 'Closed'}
                    </li>
                  ))}
                </ul>
              </JauntyBox>
            )}
          </div>
          <div
            className={classNames({
              [grid({
                s: 12,
                m: 12,
                l: 11,
                xl: 10,
                shiftL: 1,
                shiftXl: 2,
              })]: true,
            })}
          >
            {isInList && (
              <MoreLink
                url={venueAdditionalInfo[venue.name.toLowerCase()].url}
                name={venueAdditionalInfo[venue.name.toLowerCase()].linkText}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VenueHours;
