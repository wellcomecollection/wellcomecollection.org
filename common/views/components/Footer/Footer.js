// @flow
import { useRef, useEffect } from 'react';
import { spacing, font, grid, classNames } from '../../../utils/classnames';
import { getTodaysVenueHours } from '@weco/common/services/prismic/opening-times';
import FooterWellcomeLogo from '../FooterWellcomeLogo/FooterWellcomeLogo';
import FooterNav from '../FooterNav/FooterNav';
import FindUs from '../FindUs/FindUs';
// TODO import OpeningHours from '../OpeningHours/OpeningHours';
import FooterSocial from '../FooterSocial/FooterSocial';
import Icon from '../Icon/Icon';
import type { OverrideType } from '../../../model/opening-hours';
import type Moment from 'moment';
import styled from 'styled-components';

const TopBorderBox = styled.div.attrs({
  className: classNames({
    [spacing({ l: 4 }, { padding: ['top'] })]: true,
  }),
})`
  @media (min-width: ${props => props.theme.sizes.large}px) {
    border-top: 1px solid ${props => props.theme.colors.charcoal};
    border-bottom: 0;
  }
`;
type Props = {|
  hide: boolean,
  openingTimes: any, // TODO
  upcomingExceptionalOpeningPeriods: ?({
    dates: Moment[],
    type: OverrideType,
  }[]),
  extraClasses?: string,
|};

const Footer = ({
  upcomingExceptionalOpeningPeriods,
  openingTimes,
  hide = false,
}: Props) => {
  const footer = useRef(null);
  useEffect(() => {
    hide &&
      footer &&
      footer.current &&
      footer.current.classList.add('is-hidden');
  }, []);
  return (
    <div
      ref={footer}
      className={classNames({
        'footer row bg-black relative': true,
        [spacing({ s: 5, m: 10 }, { padding: ['top'] })]: true,
      })}
    >
      <div className="container">
        <div className="grid">
          <div className={` ${grid({ s: 12, m: 12, l: 4 })}`}>
            <h3 className={`footer__heading relative ${font('hnl', 4)}`}>
              <span className="hidden">Wellcome collection</span>
              <a href="#" className="footer-nav__brand absolute">
                <FooterWellcomeLogo />
              </a>
            </h3>
            <div className="border-top-width-1 border-color-charcoal">
              <FooterNav />
            </div>
          </div>
          <div className={`${grid({ s: 12, m: 6, l: 4 })}`}>
            <h3
              className={`footer__heading hidden is-hidden-s is-hidden-m ${font(
                'hnl',
                5
              )}`}
            >
              Finding us:
            </h3>
            <TopBorderBox>
              <FindUs />
            </TopBorderBox>
          </div>
          <div
            className={classNames({
              [grid({ s: 12, m: 6, l: 4, xl: 4 })]: true,
              [font('hnl', 5)]: true,
            })}
          >
            <h3
              className={`footer__heading hidden is-hidden-s is-hidden-m ${font(
                'hnl',
                5
              )}`}
            >
              {`Opening times:`}
            </h3>
            <TopBorderBox>
              <Icon
                name="clock"
                extraClasses={`float-l ${spacing(
                  { s: 2, m: 2, l: 2, xl: 2 },
                  { margin: ['right'] }
                )}`}
              />
              <div
                className={classNames({
                  [font('hnl', 5)]: true,
                  'float-l': true,
                })}
              >
                <h4
                  className={classNames({
                    [font('hnm', 5)]: true,
                    'no-margin': true,
                  })}
                >{`Today's opening times`}</h4>
                <ul className="plain-list no-padding no-margin">
                  {openingTimes.collectionOpeningTimes.placesOpeningHours.map(
                    venue => {
                      const todaysHours = getTodaysVenueHours(venue);
                      return (
                        todaysHours && (
                          <li
                            key={venue.name}
                            className={classNames({
                              [spacing({ s: 1 }, { margin: ['top'] })]: true,
                            })}
                          >
                            {venue.name.toLowerCase() === 'restaurant'
                              ? 'Kitchen '
                              : `${venue.name} `}
                            {todaysHours.opens ? (
                              <>
                                <time>{todaysHours.opens}</time>
                                {'—'}
                                <time>{todaysHours.closes}</time>
                              </>
                            ) : (
                              'closed'
                            )}
                          </li>
                        )
                      );
                    }
                  )}
                </ul>
                <p
                  className={classNames({
                    [spacing({ s: 1 }, { margin: ['top'] })]: true,
                  })}
                >
                  <a href="/opening-times">Opening times</a>
                </p>
              </div>
            </TopBorderBox>
          </div>
        </div>
        <FooterSocial />
        <div className="footer__bottom">
          <div className="footer__left">
            <div
              className={classNames({
                [font('hnm', 6)]: true,
                [spacing({ s: 2 }, { margin: ['top'] })]: true,
                [spacing({ m: 2 }, { margin: ['bottom'] })]: true,
                [spacing({ m: 4, l: 6 }, { margin: ['right'] })]: true,
                [spacing({ s: 2, m: 0 }, { padding: ['bottom'] })]: true,
                footer__strap: true,
              })}
            >
              <Icon
                name="wellcome"
                extraClasses={classNames({
                  [spacing({ s: 1 }, { margin: ['right'] })]: true,
                })}
              />
              <span className="footer__strap-text">
                The free museum and library from Wellcome
              </span>
            </div>
            <div
              className={classNames({
                [spacing({ s: 2 }, { margin: ['top', 'bottom'] })]: true,
                [font('hnm', 6)]: true,
                [spacing({ xl: 2 }, { padding: ['right'] })]: true,
                footer__licensing: true,
              })}
            >
              <div className="footer__licensing-icons">
                <Icon name="cc" />
                <Icon name="ccBy" />
              </div>
              <p className="footer__licensing-copy">
                Except where otherwise noted, content on this site is licensed
                under a{' '}
                <a
                  className="footer__licensing-link"
                  href="https://creativecommons.org/licenses/by/4.0/"
                >
                  {' '}
                  Creative Commons Attribution 4.0 International Licence
                </a>
              </p>
            </div>
          </div>
          <nav className="footer__hygiene-nav">
            <ul
              className={`plain-list footer__hygiene-list ${spacing(
                { s: 0 },
                {
                  margin: ['top', 'left', 'bottom', 'right'],
                  padding: ['left', 'bottom', 'right'],
                }
              )}`}
            >
              <li className={`footer__hygiene-item ${font('hnm', 6)}`}>
                <a
                  href="https://wellcome.ac.uk/jobs"
                  className="footer__hygiene-link"
                >
                  Jobs
                </a>
              </li>
              <li className={`footer__hygiene-item ${font('hnm', 6)}`}>
                <a
                  href="https://wellcome.ac.uk/about-us/terms-use"
                  className="footer__hygiene-link"
                >
                  Privacy
                </a>
              </li>
              <li className={`footer__hygiene-item ${font('hnm', 6)}`}>
                <a
                  href="https://wellcome.ac.uk/about-us/terms-use"
                  className="footer__hygiene-link"
                >
                  Cookies
                </a>
              </li>
              <li className={`footer__hygiene-item ${font('hnm', 6)}`}>
                <a
                  href="https://wellcomecollection.org/press"
                  className="footer__hygiene-link"
                >
                  Press
                </a>
              </li>
              <li className={`footer__hygiene-item ${font('hnm', 6)}`}>
                <a
                  href="https://developers.wellcomecollection.org"
                  className="footer__hygiene-link"
                >
                  Developers
                </a>
              </li>
              <li className={`footer__hygiene-item ${font('hnm', 6)}`}>
                <a
                  href="#top"
                  className="footer__hygiene-link footer__hygiene-link--back-to-top"
                >
                  <span>Back to top</span>
                  <Icon name="arrow" extraClasses="icon--270" />
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default Footer;
