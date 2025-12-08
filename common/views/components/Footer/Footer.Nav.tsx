import Link from 'next/link';
import { ReactElement } from 'react';
import styled from 'styled-components';

import { prismicPageIds } from '@weco/common/data/hardcoded-ids';
import { font } from '@weco/common/utils/classnames';
import { links, NavLink } from '@weco/common/views/components/Header';
import Space from '@weco/common/views/components/styled/Space';

const NavList = styled.ul<{
  $isInline?: boolean;
}>`
  list-style-type: none;
  display: inline-block;
  padding: 0;
  margin: 0;

  li:first-child a {
    padding-top: 0;
  }

  ${props =>
    props.$isInline &&
    `
      li {
        display: inline-block;
        margin-right: 1.1rem;

        &:last-child {
          margin-right: 0;
        }
      }
  `}
`;

const NavLinkElement = styled(Space).attrs({
  className: font('sans', -1),
  $v: {
    size: '2xs',
    properties: ['padding-top', 'padding-bottom'],
  },
})`
  display: block;
  transition: color 200ms ease;

  &:hover {
    text-decoration: none;
  }
`;

const InternalNavigation: NavLink[] = [
  ...links,
  {
    href: `/${prismicPageIds.contactUs}`,
    title: 'Contact us',
  },
];

const PoliciesNavigation: NavLink[] = [
  { href: 'https://wellcome.org/jobs', title: 'Jobs' },
  { href: `/about-us/${prismicPageIds.press}`, title: 'Media office' },
  {
    href: 'https://developers.wellcomecollection.org',
    title: 'Developers',
  },
  {
    href: 'https://wellcome.org/who-we-are/privacy-and-terms',
    title: 'Privacy and terms',
  },

  {
    href: `/about-us/${prismicPageIds.cookiePolicy}`,
    title: 'Cookie policy',
  },
  {
    href: '/',
    title: 'Manage cookies',
  },
  {
    href: 'https://wellcome.org/who-we-are/modern-slavery-statement',
    title: 'Modern slavery statement',
  },
];

const FooterNav = ({
  type,
  ariaLabel,
  isInline,
}: {
  type: 'InternalNavigation' | 'PoliciesNavigation';
  ariaLabel: string;
  isInline?: boolean;
}): ReactElement => {
  const itemsList =
    type === 'PoliciesNavigation' ? PoliciesNavigation : InternalNavigation;

  return (
    <nav style={{ display: 'flex' }} aria-label={ariaLabel}>
      <NavList aria-label="Footer navigation" $isInline={isInline}>
        {itemsList.map((link, i) => {
          // ID for Javascript-less users who tried to click on the Burger menu and will get redirected here
          const isBurgerMenuLink = type === 'InternalNavigation' && i === 0;
          const isManageCookies = link.title === 'Manage cookies';

          return isManageCookies ? (
            <li key={link.title}>
              <Link
                href={link.href}
                onClick={e => {
                  e.preventDefault();
                  window.CookieControl.open();
                }}
                style={{ display: 'block' }}
              >
                <NavLinkElement>{link.title}</NavLinkElement>
              </Link>
            </li>
          ) : (
            !isManageCookies && (
              <li key={link.title}>
                <NavLinkElement
                  as="a"
                  href={link.href}
                  data-gtm-trigger="footer_nav_link"
                  {...(isBurgerMenuLink && { id: 'footer-nav-1' })}
                >
                  {link.title}
                </NavLinkElement>
              </li>
            )
          );
        })}
      </NavList>
    </nav>
  );
};

export default FooterNav;
