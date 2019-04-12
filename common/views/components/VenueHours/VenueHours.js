import { useContext, useRef, useEffect } from 'react';
import { classNames, font, grid, spacing } from '@weco/common/utils/classnames';
import styled from 'styled-components';
import MoreLink from '@weco/common/views/components/Links/MoreLink/MoreLink';
import Icon from '@weco/common/views/components/Icon/Icon';
import Divider from '@weco/common/views/components/Divider/Divider';
import { UiImage } from '@weco/common/views/components/Images/Images';
import {
  backfillExceptionalVenueDays,
  getUpcomingExceptionalPeriod,
  getExceptionalOpeningPeriods,
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
    'bg-yellow inline-block': true,
    [spacing({ s: 4 }, { padding: ['top', 'bottom'] })]: true,
    [spacing({ s: 5 }, { padding: ['left'] })]: true,
    [spacing({ s: 7 }, { padding: ['right'] })]: true,
    [spacing({ s: -2, m: -4 }, { margin: ['left', 'right'] })]: true,
  }),
}))`
  transition: clip-path 600ms ease;
  clip-path: polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%);
`;

const randomPx = () => `${Math.floor(Math.random() * 20)}px`;

type Props = {|
  venue: any, // FIXME: Flow
  isInList: boolean,
|};

const VenueHours = ({ venue, isInList }: Props) => {
  const openingTimes = useContext(OpeningTimesContext);
  const exceptionalPeriods = getExceptionalOpeningPeriods(openingTimes);
  const upcomingExceptionalPeriod = getUpcomingExceptionalPeriod(
    backfillExceptionalVenueDays(venue, exceptionalPeriods)
  );

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

  const jauntyRef = useRef(null);

  function setRandomClipPath() {
    const topLeft = randomPx();
    const topRight = randomPx();
    const bottomRight = randomPx();
    const bottomLeft = randomPx();

    ['clipPath', 'webkitClipPath'].forEach(property => {
      jauntyRef.current.style[property] = `polygon(
        ${topLeft} ${topLeft},
        calc(100% - ${topRight}) ${topRight},
        100% calc(100% - ${bottomRight}),
        ${bottomLeft} 100%
      )`;
    });
  }

  useEffect(() => {
    setRandomClipPath();
  });

  return (
    <div className="row">
      <div className="container">
        <div className="grid">
          {isInList && (
            <>
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
                <UiImage
                  contentUrl={
                    venueAdditionalInfo[venue.name.toLowerCase()].image
                  }
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
          <div
            className={classNames({
              [grid({ s: 12, m: 5, l: 3, xl: 3 })]: true,
              [grid({ shiftM: 1, shiftL: 2, shiftXl: 2 })]: !isInList,
              [spacing({ s: 2 }, { margin: ['bottom'] })]: true,
            })}
          >
            <h2
              className={classNames({
                h2: true,
                [spacing({ s: 2 }, { padding: ['right'] })]: true,
              })}
            >
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
              <JauntyBox ref={jauntyRef}>
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
                      {upcomingExceptionalPeriod[0][0].overrideType} hours
                    </span>
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
                m: isInList ? 12 : 10,
                l: 11,
                xl: 10,
                shiftM: isInList ? 0 : 1,
                shiftL: isInList ? 1 : 2,
                shiftXl: 2,
              })]: true,
            })}
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
        </div>
      </div>
    </div>
  );
};

export default VenueHours;
