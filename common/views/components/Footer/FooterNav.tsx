import { FunctionComponent } from 'react';
import { font } from '../../../utils/classnames';
import Space from '../styled/Space';
import { links } from '../Header/Header';
import styled from 'styled-components';
import { prismicPageIds } from '@weco/common/data/hardcoded-ids';

const NavList = styled.ul`
  flex: 1 1 30%;
  list-style-type: none;
  padding: 0;
  margin: 0;

  li:first-child a {
    padding-top: 0;
  }
`;

const NavLink = styled(Space).attrs({
  className: font('intr', 5),
  v: {
    size: 's',
    properties: ['padding-top', 'padding-bottom'],
  },
})`
  display: block;
  transition: color 200ms ease;

  &:hover {
    text-decoration: none;
  }
`;

const FooterNav: FunctionComponent = () => {
  return (
    <NavList role="navigation">
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
    </NavList>
  );
};

export default FooterNav;
