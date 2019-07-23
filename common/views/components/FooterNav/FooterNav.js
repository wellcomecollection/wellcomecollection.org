// @flow
import { font } from '../../../utils/classnames';
import VerticalSpace from '../styled/VerticalSpace';

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
    text: 'Collections',
  },
  {
    url: 'https://wellcomecollection.org/what-we-do',
    text: 'What we do',
  },
];

const FooterNav = () => (
  <div className="footer-nav">
    <nav className="footer-nav__nav">
      <ul className={`plain-list footer-nav__list no-margin no-padding`}>
        {navLinks.map((link, i) => (
          <li key={link.text} className="footer-nav__item">
            <VerticalSpace
              as="a"
              size="s"
              properties={['padding-top', 'padding-bottom']}
              id={`footer-nav-${i}`}
              href={link.url}
              className={`footer-nav__link ${font('wb', 5)}`}
            >
              {link.text}
            </VerticalSpace>
          </li>
        ))}
      </ul>
    </nav>
  </div>
);

export default FooterNav;
