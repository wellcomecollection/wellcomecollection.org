// @flow
import { spacing, font } from '../../../utils/classnames';
import TogglesContext from '@weco/common/views/components/TogglesContext/TogglesContext';

// TODO: share these with the main nav
const navLinks = [
  {
    url: 'https://wellcomecollection.org/visit',
    text: 'Visit us',
  },
  {
    url: '/whats-on',
    text: `What's on`,
  },
  {
    url: '/stories',
    text: 'Stories',
  },
  {
    url: '/works',
    text: 'Images',
  },
  {
    url: 'https://wellcomecollection.org/what-we-do',
    text: 'What we do',
  },
];

const FooterNav = () => (
  <div className="footer-nav">
    <nav className="footer-nav__nav">
      <ul
        className={`plain-list footer-nav__list ${spacing(
          { s: 0 },
          {
            margin: ['top', 'left', 'bottom', 'right'],
            padding: ['top', 'left', 'bottom', 'right'],
          }
        )}`}
      >
        <TogglesContext.Consumer>
          {({ booksRelease }) => (
            <>
              {navLinks.map((link, i) => (
                <li key={link.text} className="footer-nav__item">
                  <a
                    id={`footer-nav-${i}`}
                    href={link.url}
                    className={`footer-nav__link ${font({ s: 'WB7' })}`}
                  >
                    {booksRelease && link.text === 'Images'
                      ? 'Collections'
                      : link.text}
                  </a>
                </li>
              ))}
            </>
          )}
        </TogglesContext.Consumer>
      </ul>
    </nav>
  </div>
);

export default FooterNav;
