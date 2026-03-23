import Link from 'next/link';
import { FunctionComponent, useState } from 'react';
import styled from 'styled-components';

import { tokens } from '@weco/dash/views/themes/tokens';

const MOBILE_BREAKPOINT = '768px';

const Wrapper = styled.header`
  background: ${tokens.colors.primary.dark};
  border-bottom: 1px solid ${tokens.colors.black};
  height: 85px;
  display: flex;
  align-items: stretch;
  position: relative;
  z-index: 6;
`;

const SkipLink = styled.a`
  position: absolute;
  left: -9999px;
  top: auto;
  width: 1px;
  height: 1px;
  overflow: hidden;

  &:focus {
    position: fixed;
    top: ${tokens.spacing.sm};
    left: ${tokens.spacing.sm};
    width: auto;
    height: auto;
    padding: ${tokens.spacing.sm} ${tokens.spacing.md};
    background: ${tokens.colors.white};
    color: ${tokens.colors.black};
    font-weight: 600;
    z-index: 1000;
    border-radius: ${tokens.borderRadius.small};
    outline: ${tokens.focus.outline};
    box-shadow: ${tokens.focus.boxShadow};
  }
`;

const Container = styled.div`
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
  padding: 0 ${tokens.spacing.lg};
  display: flex;
  align-items: center;
`;

const Brand = styled.div`
  display: flex;
  align-items: center;
  flex-shrink: 0;
  margin-right: ${tokens.spacing.md};
  padding-right: ${tokens.spacing.md};
  border-right: 1px solid rgba(255, 255, 255, 0.2);
  align-self: stretch;

  @media (max-width: ${MOBILE_BREAKPOINT}) {
    margin: 0 auto;
    padding-right: 0;
    border-right: none;
  }
`;

const LogoLink = styled.a`
  display: flex;
  align-items: center;
  gap: ${tokens.spacing.md};
  text-decoration: none;
  transition: opacity 150ms ease;

  &:hover {
    opacity: 0.8;
    color: ${tokens.colors.white};
  }
`;

const DashBadge = styled.span`
  background: ${tokens.colors.white};
  color: ${tokens.colors.primary.dark};
  padding: 2px 8px;
  border-radius: ${tokens.borderRadius.small};
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.05em;
`;

const BurgerButton = styled.button<{ $isOpen: boolean }>`
  display: none;
  background: none;
  border: none;
  cursor: pointer;
  padding: ${tokens.spacing.sm};
  position: relative;
  width: 2.4rem;
  height: 2.4rem;

  &:focus-visible {
    outline: ${tokens.focus.outline};
    box-shadow: ${tokens.focus.boxShadow};
  }

  @media (max-width: ${MOBILE_BREAKPOINT}) {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  span {
    display: block;
    position: absolute;
    left: 0.5rem;
    right: 0.5rem;
    height: 2px;
    background: ${tokens.colors.white};
    transition:
      transform 300ms ease,
      opacity 200ms ease;

    &:nth-child(1) {
      top: 0.55rem;
      ${props =>
        props.$isOpen &&
        `
        top: 1.1rem;
        transform: rotate(45deg);
      `}
    }

    &:nth-child(2) {
      top: 1.1rem;
      ${props => props.$isOpen && 'opacity: 0;'}
    }

    &:nth-child(3) {
      top: 1.65rem;
      ${props =>
        props.$isOpen &&
        `
        top: 1.1rem;
        transform: rotate(-45deg);
      `}
    }
  }
`;

const Nav = styled.nav<{ $isOpen: boolean }>`
  display: flex;
  align-items: center;

  @media (max-width: ${MOBILE_BREAKPOINT}) {
    display: ${props => (props.$isOpen ? 'block' : 'none')};
    position: absolute;
    top: 85px;
    left: 0;
    right: 0;
    background: ${tokens.colors.primary.dark};
    border-top: 1px solid rgba(255, 255, 255, 0.2);
    border-bottom: 1px solid ${tokens.colors.black};
    padding: ${tokens.spacing.sm} 0;
    z-index: 10;
  }
`;

const NavList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  align-items: center;

  @media (max-width: ${MOBILE_BREAKPOINT}) {
    flex-direction: column;
    align-items: stretch;
  }
`;

const NavItem = styled.li`
  & + & {
    margin-left: 1.4rem;
  }

  @media (max-width: ${MOBILE_BREAKPOINT}) {
    & + & {
      margin-left: 0;
    }
  }
`;

const NavLink = styled(Link)<{ $isActive: boolean }>`
  color: ${tokens.colors.white};
  text-decoration: none;
  font-weight: 700;
  font-size: 0.9375rem;
  padding: 1rem 0.3rem;
  display: inline-block;
  position: relative;
  transition: color 400ms ease;

  &:hover {
    color: ${tokens.colors.white};
  }

  &::after {
    content: '';
    position: absolute;
    bottom: 0.6rem;
    left: 0;
    width: ${props => (props.$isActive ? '100%' : '0')};
    height: 3px;
    background: ${tokens.colors.yellow};
    transition: width 200ms ease;
  }

  &:hover::after {
    width: 100%;
  }

  @media (max-width: ${MOBILE_BREAKPOINT}) {
    display: block;
    padding: 0.75rem ${tokens.spacing.lg};
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    ${props => props.$isActive && `background: rgba(255, 255, 255, 0.05);`}

    &::after {
      display: none;
    }
  }
`;

const navItems = [
  { href: '/toggles', title: 'Toggles' },
  { href: '/pa11y', title: 'Pa11y' },
  { href: '/prismic-linting', title: 'Prismic' },
];

const Header: FunctionComponent<{ activePath?: string }> = ({ activePath }) => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <Wrapper>
      <SkipLink href="#main-content">Skip to main content</SkipLink>
      <Container>
        <Brand>
          <LogoLink href="/">
            <img
              src="https://i.wellcomecollection.org/assets/icons/android-chrome-192x192.png"
              width={36}
              height={36}
              alt="Wellcome Collection"
              style={{ display: 'block' }}
            />
            <DashBadge>DASHBOARD</DashBadge>
          </LogoLink>
        </Brand>

        <BurgerButton
          $isOpen={menuOpen}
          onClick={() => setMenuOpen(prev => !prev)}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
        >
          <span />
          <span />
          <span />
        </BurgerButton>

        <Nav aria-label="Main navigation" $isOpen={menuOpen}>
          <NavList>
            {navItems.map(({ href, title: label }) => {
              const isActive = activePath === href;
              return (
                <NavItem key={href}>
                  <NavLink
                    href={href}
                    $isActive={isActive}
                    {...(isActive ? { 'aria-current': 'page' as const } : {})}
                  >
                    {label}
                  </NavLink>
                </NavItem>
              );
            })}
          </NavList>
        </Nav>
      </Container>
    </Wrapper>
  );
};

export default Header;
