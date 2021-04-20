// @flow
import { FunctionComponent, useContext, useState } from 'react';
import { font, classNames } from '../../../utils/classnames';
import WellcomeCollectionBlack from '../../../icons/wellcome_collection_black';
import TogglesContext from '../TogglesContext/TogglesContext';

export const navHeight = 85;

type Props = {
  siteSection: string | null;
};

export const links = [
  {
    href: '/visit-us',
    title: 'Visit us',
    siteSection: 'visit-us',
  },
  {
    href: '/whats-on',
    title: "What's on",
    siteSection: 'whats-on',
  },
  {
    href: '/stories',
    title: 'Stories',
    siteSection: 'stories',
  },
  {
    href: '/collections',
    title: 'Collections',
    siteSection: 'collections',
  },
  {
    href: '/what-we-do',
    title: 'What we do',
    siteSection: 'what-we-do',
  },
];

export const siteSectionsWithGetInvolvedAndAboutUs = [
  {
    href: '/visit-us',
    title: 'Visit us',
    siteSection: 'visit-us',
  },
  {
    href: '/whats-on',
    title: "What's on",
    siteSection: 'whats-on',
  },
  {
    href: '/stories',
    title: 'Stories',
    siteSection: 'stories',
  },
  {
    href: '/collections',
    title: 'Collections',
    siteSection: 'collections',
  },
  {
    href: '/get-involved',
    title: 'Get involved',
    siteSection: 'get-involved',
  },
  {
    href: '/about-us',
    title: 'About us',
    siteSection: 'about-us',
  },
];

const Header: FunctionComponent<Props> = ({ siteSection }) => {
  const [isActive, setIsActive] = useState(false);
  const { newSiteSections } = useContext(TogglesContext);
  const siteSections = newSiteSections
    ? siteSectionsWithGetInvolvedAndAboutUs
    : links;

  return (
    <div
      className={classNames({
        'header grid bg-white border-color-pumice border-bottom-width-1': true,
        'header--is-burger-open': isActive,
      })}
      style={{
        height: `${navHeight}px`,
      }}
    >
      <span className="visually-hidden">reset focus</span>
      <div className="header__upper grid__cell">
        <div className="header__inner container">
          <div className="header__burger">
            <a
              href="#footer-nav-1"
              id="header-burger-trigger"
              className="header__burger-trigger"
              aria-label="menu"
              onClick={event => {
                event.preventDefault();
                setIsActive(!isActive);
              }}
            >
              <span />
              <span />
              <span />
            </a>
          </div>
          <div className="header__brand">
            <a href="/" className="header__brand-link">
              <WellcomeCollectionBlack />
            </a>
          </div>
          <nav
            id="header-nav"
            className="header__nav"
            aria-labelledby="header-burger-trigger"
          >
            <ul
              className={`plain-list header__list ${font(
                'wb',
                5
              )} no-margin no-padding`}
            >
              {siteSections.map((link, i) => (
                <li
                  className={`header__item ${
                    link.siteSection === siteSection
                      ? ' header__item--is-current'
                      : ''
                  }`}
                  key={i}
                >
                  <a
                    className="header__link"
                    href={link.href}
                    {...(link.siteSection === siteSection
                      ? { 'aria-current': true }
                      : {})}
                  >
                    {link.title}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          {/* we leave this here until we know exactly what we want to do with search */}
          <div id="header-search" className="header__search" />
        </div>
      </div>
    </div>
  );
};

export default Header;
