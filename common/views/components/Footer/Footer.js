// @flow
import {spacing, font, grid} from '../../../utils/classnames';
import FooterWellcomeLogo from '../FooterWellcomeLogo/FooterWellcomeLogo';
import FooterNav from '../FooterNav/FooterNav';
import FindUs from '../FindUs/FindUs';
import OpeningHours from '../OpeningHours/OpeningHours';
import FooterSocial from '../FooterSocial/FooterSocial';
import Icon from '../Icon/Icon';
import type {PlacesOpeningHours} from '../../../model/opening-hours';

type Props = {|
  openingHoursId: string,
  extraClasses: string,
  groupedVenues: {
    [string]: PlacesOpeningHours
  },
  upcomingExceptionalOpeningPeriods: {dates: Date[], type: string}[]
|}

const Footer = ({openingHoursId, extraClasses, groupedVenues, upcomingExceptionalOpeningPeriods}: Props) => (
  <div className={`footer row bg-black ${spacing({s: 5, m: 10}, {padding: ['top']})}`}>
    <div className='container'>
      <div className='grid'>
        <div className={` ${grid({s: 12, m: 6, l: 3})}`}>
          <h3 className={`footer__heading relative ${font({s: 'HNL5'})}`}>
            <span className='hidden'>Wellcome collection</span>
            <a href='#' className='footer-nav__brand absolute'>
              <FooterWellcomeLogo />
            </a>
          </h3>
          <div className='border-top-width-1 border-color-charcoal'>
            <FooterNav />
          </div>
        </div>
        <div className={`${grid({s: 12, m: 6, l: 3})}`}>
          <h3 className={`footer__heading ${font({s: 'HNL5'})}`}>Finding us:</h3>
          <FindUs />
        </div>
        <div className={`${grid({s: 12, l: 6, xl: 6})}`}>
          <h3 className={`footer__heading ${font({s: 'HNL5'})}`}>Opening times:</h3>
          <OpeningHours
            extraClasses={extraClasses}
            groupedVenues={groupedVenues}
            upcomingExceptionalOpeningPeriods={upcomingExceptionalOpeningPeriods} />
        </div>
      </div>
      <div className='grid'>
        <div className='grid__cell'>
          <h3 className={`footer__heading ${font({s: 'HNL5'})}`}>Connect with us:</h3>
        </div>
      </div>
      <FooterSocial />
      <div className='footer__bottom'>
        <div className={`footer__left ${spacing({s: 2, l: 0}, {margin: ['bottom']})}`}>
          <div className={`footer__strap ${font({s: 'HNM6'})} ${spacing({m: 4, l: 6}, {margin: ['right']})}`}>
            <Icon name='wellcome' />
            <span className='footer__strap-text'>The free museum and library from Wellcome</span>
          </div>
          <div className={`footer__licensing ${font({s: 'HNM6'})} ${spacing({xl: 2}, {padding: ['right']})}`}>
            <div className='footer__licensing-icons'>
              <Icon name='cc' />
              <Icon name='ccBy' />
            </div>
            <p className='footer__licensing-copy'>Except where otherwise noted, content on this site is licensed under a <a className='footer__licensing-link' href='https://creativecommons.org/licenses/by/4.0/'> Creative Commons Attribution 4.0 International Licence</a></p>
          </div>
        </div>
        <nav className='footer__hygiene-nav'>
          <ul className={`plain-list footer__hygiene-list ${spacing({s: 0}, {margin: ['top', 'left', 'bottom', 'right'], padding: ['left', 'bottom', 'right']})}`}>
            <li className={`footer__hygiene-item ${font({s: 'HNM6'})}`}>
              <a href='https://wellcome.ac.uk/jobs' className='footer__hygiene-link'>Jobs</a>
            </li>
            <li className={`footer__hygiene-item ${font({s: 'HNM6'})}`}>
              <a href='https://wellcome.ac.uk/about-us/terms-use' className='footer__hygiene-link'>Privacy</a>
            </li>
            <li className={`footer__hygiene-item ${font({s: 'HNM6'})}`}>
              <a href='https://wellcome.ac.uk/about-us/terms-use' className='footer__hygiene-link'>Cookies</a>
            </li>
            <li className={`footer__hygiene-item ${font({s: 'HNM6'})}`}>
              <a href='https://wellcomecollection.org/press/press-releases' className='footer__hygiene-link'>Press</a>
            </li>
            <li className={`footer__hygiene-item ${font({s: 'HNM6'})}`}>
              <a href='https://developers.wellcomecollection.org' className='footer__hygiene-link'>Developers</a>
            </li>
            <li className={`footer__hygiene-item ${font({s: 'HNM6'})}`}>
              <a href='#top' className='footer__hygiene-link footer__hygiene-link--back-to-top'>
                <span>Back to top</span>
                <Icon name='arrow' extraClasses='icon--270' />
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  </div>
);

export default Footer;
