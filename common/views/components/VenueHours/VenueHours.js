import { classNames, font, grid, spacing } from '@weco/common/utils/classnames';
import styled from 'styled-components';
import MoreLink from '@weco/common/views/components/Links/MoreLink/MoreLink';
import Icon from '@weco/common/views/components/Icon/Icon';
import Divider from '@weco/common/views/components/Divider/Divider';

const VenueHoursImage = styled.div.attrs(props => ({
  className: classNames({
    [grid({ s: 12, m: 6, l: 4, xl: 3, shiftXl: 2 })]: true,
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

const VenueHours = () => {
  return (
    <div className="row">
      <div className="container">
        <div className="grid">
          <div
            className={classNames({
              [spacing({ s: 4 }, { padding: ['bottom'] })]: true,
              [grid({ s: 12, m: 12, l: 12, xl: 10, shiftXl: 2 })]: true,
              'is-hidden-s': true,
            })}
          >
            <Divider extraClasses="divider--keyline divider--pumice" />
          </div>
          <VenueHoursImage>
            <img src="http://fillmurray.com/1600/900" />
          </VenueHoursImage>
          <div
            className={classNames({
              [grid({ s: 12, m: 6, l: 3, xl: 3 })]: true,
              [spacing({ s: 2 }, { margin: ['bottom'] })]: true,
            })}
          >
            <h3 className="h3">Galleries and Reading Room</h3>
            <ul
              className={classNames({
                'plain-list no-padding no-margin': true,
                [font({ s: 'HNL4' })]: true,
              })}
            >
              <li>Monday Closed</li>
              <li>Tuesday 10:00&mdash;18:00</li>
              <li>Wednesday 10:00&mdash;18:00</li>
              <li>Thursday 10:00&mdash;22:00</li>
              <li>Friday 10:00&mdash;18:00</li>
              <li>Saturday 10:00&mdash;18:00</li>
              <li>Sunday 11:00&mdash;18:00</li>
            </ul>
          </div>
          <div
            className={classNames({
              [grid({ s: 12, m: 6, l: 5, xl: 4 })]: true,
              [spacing({ s: 2 }, { margin: ['bottom'] })]: true,
            })}
          >
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
                  <span>Easter hours</span>
                </div>
              </h3>
              <ul
                className={classNames({
                  'plain-list no-padding no-margin': true,
                  [font({ s: 'HNL4' })]: true,
                })}
              >
                <li>Friday 19 April Closed</li>
                <li>Saturday 30 December 10:00&mdash;18:00</li>
                <li>Sunday 21 April 10:00&mdash;18:00</li>
                <li>Monday 22 April 10:00&mdash;22:00</li>
              </ul>
            </JauntyBox>
          </div>
          <div
            className={classNames({
              [grid({ s: 12, m: 12, l: 4, xl: 3, shiftXl: 2 })]: true,
            })}
          >
            <MoreLink url="#" name="See all Exhibitions and Events" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default VenueHours;
