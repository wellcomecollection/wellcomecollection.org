// @flow
import type {Link} from '../../../model/link';
import {spacing, font} from '../../../utils/classnames';

type Props = {|
  navLinks: Array<Link>
|}

const FooterNav = ({navLinks}: Props) => (
  <div className='footer-nav'>
    <nav className='footer-nav__nav'>
      <ul className={`plain-list footer-nav__list ${spacing({s: 0}, {margin: ['top', 'left', 'bottom', 'right'], padding: ['top', 'left', 'bottom', 'right']})}`}>
        {navLinks.map((link, i) => (
          <li key={link.text} className='footer-nav__item'><a id={`footer-nav-${i}`} href='{link.url}' className={`footer-nav__link ${font({s: 'WB7'})}`}>{link.text}</a></li>
        ))}
      </ul>
    </nav>
  </div>
);

export default FooterNav;
