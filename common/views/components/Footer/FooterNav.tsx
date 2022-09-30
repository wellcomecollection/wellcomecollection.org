import { ReactElement } from 'react';
import { font } from '@weco/common/utils/classnames';
import Space from '@weco/common/views/components/styled/Space';
import styled from 'styled-components';
import { NavLink } from '@weco/common/views/components/Header/Header';

const NavList = styled.ul<{ isInline: boolean | undefined }>`
  flex: 1 1 30%;
  list-style-type: none;
  padding: 0;
  margin: 0;

  ${props =>
    props.isInline &&
    `
      display: flex;
      flex-direction: column;

      ${props.theme.media('medium')(`
        flex-direction: row;
        border-top: 1px solid ${props.theme.color('neutral.700')};
      `)}

      li {
        margin-right: 3rem;

        &:last-child {
          margin-right: 0;
        }
      }
  `}
  ${props =>
    !props.isInline &&
    `
      li:first-child a {
        padding-top: 0;
      }
  `}
`;

const NavLinkElement = styled(Space).attrs({
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

// TODO add description to explain what nav it is
const FooterNav = ({
  items,
  isInline,
}: {
  items: NavLink[];
  isInline?: boolean;
}): ReactElement => {
  return (
    <NavList role="navigation" isInline={isInline}>
      {items.map((link, i) => (
        <li key={link.title}>
          <NavLinkElement id={`footer-nav-${i}`} as="a" href={link.href}>
            {link.title}
          </NavLinkElement>
        </li>
      ))}
    </NavList>
  );
};

export default FooterNav;
