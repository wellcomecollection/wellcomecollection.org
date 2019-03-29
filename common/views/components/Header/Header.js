// @flow
import TogglesContext from '@weco/common/views/components/TogglesContext/TogglesContext';
import { withToggler } from '../../hocs/withToggler';
import { font, spacing } from '../../../utils/classnames';
import WellcomeCollectionBlack from '../../../icons/wellcome_collection_black';

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
    title: 'Images',
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
    className={`header grid js-header-burger js-focus-trap bg-white border-color-pumice border-bottom-width-1 ${
      isActive ? 'header--is-burger-open' : ''
    }`}
  >
    <span className="visually-hidden js-trap-reverse-end">reset focus</span>
    <div className="header__upper grid__cell">
      <div className="header__inner container">
        <div className="header__burger">
          <a
            href="#footer-nav-1"
            id="header-burger-trigger"
            className="header__burger-trigger js-header-burger-trigger js-trap-start"
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
          className="header__nav js-header-burger-drawer"
          aria-labelledby="header-burger-trigger"
        >
          <TogglesContext.Consumer>
            {({ booksRelease }) => (
              <ul
                className={`plain-list header__list ${font({
                  s: 'WB7',
                })} ${spacing(
                  { s: 0 },
                  {
                    margin: ['top', 'left', 'bottom', 'right'],
                    padding: ['top', 'left', 'bottom', 'right'],
                  }
                )}`}
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
                      className="header__link js-header-nav-link"
                      href={link.href}
                      {...(link.siteSection === siteSection
                        ? { 'aria-current': true }
                        : {})}
                    >
                      {booksRelease && link.title === 'Images'
                        ? 'Collections'
                        : link.title}
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </TogglesContext.Consumer>
        </nav>
        {/* we leave this here until we know exactly what we want to do with search */}
        <div id="header-search" className="header__search" />
        <span className="visually-hidden js-trap-end">reset focus</span>
      </div>
    </div>
  </div>
));

export default Header;
