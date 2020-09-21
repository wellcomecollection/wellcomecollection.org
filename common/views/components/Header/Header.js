// @flow
import { withToggler } from '../../hocs/withToggler';
import { font, classNames } from '../../../utils/classnames';
import WellcomeCollectionBlack from '../../../icons/wellcome_collection_black';

export const navHeight = 85;

const links = [
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
    href: '/works',
    title: 'Collections',
    siteSection: 'works',
  },
  {
    href: '/what-we-do',
    title: 'What we do',
    siteSection: 'what-we-do',
  },
];

type Props = {|
  siteSection: string,
  isActive: boolean,
  toggle: () => void,
|};

const Header = withToggler(({ siteSection, toggle, isActive }: Props) => (
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
              toggle();
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
            {links.map((link, i) => (
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
));

export default Header;
