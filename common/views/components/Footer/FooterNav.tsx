import { FunctionComponent } from 'react';
import { font } from '../../../utils/classnames';
import Space from '../styled/Space';
import { links } from '../Header/Header';
import styled from 'styled-components';
import { prismicPageIds } from '@weco/common/data/hardcoded-ids';

const NavLink = styled(Space).attrs({
  className: font('wb', 5),
  v: {
    size: 's',
    properties: ['padding-top', 'padding-bottom'],
  },
})`
  display: block;
  text-decoration: none;
  transition: color 200ms ease;

  &:hover {
    color: ${props => props.theme.color('green')};
  }
`;

const FooterNav: FunctionComponent = () => {
  return (
    <div>
      <nav>
        <ul className="plain-list no-margin no-padding">
          {links.map((link, i) => (
            <li key={link.title}>
              <NavLink id={`footer-nav-${i}`} as="a" href={link.href}>
                {link.title}
              </NavLink>
            </li>
          ))}
          <li>
            <NavLink as="a" href={`/pages/${prismicPageIds.contactUs}`}>
              Contact us
            </NavLink>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default FooterNav;
