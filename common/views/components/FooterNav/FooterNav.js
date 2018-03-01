// @flow
import {spacing, font} from '../../../utils/classnames';

type navLink = {|
  href: string,
  title: string
|}

type Props = {|
  navLinks: Array<navLink>
|}

const FooterNav = ({navLinks}: Props) => (
  <div className='footer-nav'>
    <nav className='footer-nav__nav'>
      <ul className={`plain-list footer-nav__list ${spacing({s: 0}, {margin: ['top', 'left', 'bottom', 'right'], padding: ['top', 'left', 'bottom', 'right']})}`}>
        {navLinks.map((link, i) => (
          <li key={link.title} className='footer-nav__item'><a id={`footer-nav-${i}`} href='{link.href}' className={`footer-nav__link ${font({s: 'WB7'})}`}>{link.title}</a></li>
        ))}
      </ul>
    </nav>
  </div>
);

export default FooterNav;
