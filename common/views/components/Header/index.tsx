import { FocusTrap } from 'focus-trap-react';
import NextLink from 'next/link';
import { FunctionComponent, useRef, useState } from 'react';
import styled from 'styled-components';

import { useAppContext } from '@weco/common/contexts/AppContext';
import { prismicPageIds } from '@weco/common/data/hardcoded-ids';
import { searchLabelText } from '@weco/common/data/microcopy';
import { cross, search } from '@weco/common/icons';
import WellcomeCollectionBlack from '@weco/common/icons/wellcome_collection_black';
import { SiteSection } from '@weco/common/model/site-section';
import { useToggles } from '@weco/common/server-data/Context';
import { font } from '@weco/common/utils/classnames';
import Icon from '@weco/common/views/components/Icon';

import HeaderExhibitionNav from './Header.ExhibitionNav';
import HeaderSearch from './Header.Search';
import DesktopSignIn from './Header.SignIn.Desktop';
import MobileSignIn from './Header.SignIn.Mobile';
import {
  Burger,
  BurgerTrigger,
  HeaderActions,
  HeaderBrand,
  HeaderContainer,
  HeaderItem,
  HeaderLink,
  HeaderList,
  HeaderNav,
  NavLoginWrapper,
  SearchButton,
  Wrapper,
} from './Header.styles';

const NoJSIconWrapper = styled.div`
  padding: 5px 8px 0;
  margin-right: 10px;
`;

export type NavLink = {
  href: string;
  title: string;
  siteSection?: SiteSection;
};

type Props = {
  siteSection?: SiteSection;
  customNavLinks?: NavLink[];
  isMinimalHeader?: boolean;
  hasColorBackground?: boolean;
  currentUrl?: string;
};

export const links: NavLink[] = [
  {
    href: `/${prismicPageIds.visitUs}`,
    title: 'Visit us',
    siteSection: 'visit-us',
  },
  {
    href: `/${prismicPageIds.whatsOn}`,
    title: 'What’s on',
    siteSection: 'whats-on',
  },
  {
    href: '/stories',
    title: 'Stories',
    siteSection: 'stories',
  },
  {
    href: `/${prismicPageIds.collections}`,
    title: 'Collections',
    siteSection: 'collections',
  },
  {
    href: `/${prismicPageIds.getInvolved}`,
    title: 'Get involved',
    siteSection: 'get-involved',
  },
  {
    href: `/${prismicPageIds.aboutUs}`,
    title: 'About us',
    siteSection: 'about-us',
  },
];

export const exhibitionGuidesLinks: NavLink[] = [
  {
    href: '/guides/exhibitions',
    title: 'Exhibition guides',
    siteSection: 'exhibition-guides',
  },
];

const Header: FunctionComponent<Props> = ({
  siteSection,
  customNavLinks,
  hasColorBackground,
  // We don't display login and search on certain pages, e.g. exhibition guides
  isMinimalHeader = false,
  currentUrl,
}) => {
  const [burgerMenuIsActive, setBurgerMenuIsActive] = useState(false);
  const [searchDropdownIsActive, setSearchDropdownIsActive] = useState(false);
  const searchButtonRef = useRef<HTMLButtonElement>(null);
  const { isEnhanced } = useAppContext();
  const { inGallery = false } = useToggles();
  const displayMinimalHeader = isMinimalHeader || inGallery;

  return (
    <FocusTrap
      active={searchDropdownIsActive || burgerMenuIsActive}
      focusTrapOptions={{ preventScroll: true }}
    >
      <header
        className="is-hidden-print"
        data-component="header"
        data-lock-scroll={searchDropdownIsActive || burgerMenuIsActive}
      >
        <Wrapper
          $isBurgerOpen={burgerMenuIsActive}
          $hasColorBackground={hasColorBackground}
        >
          <div style={{ position: 'relative' }}>
            <HeaderContainer>
              <Burger>
                <BurgerTrigger
                  $burgerMenuisActive={burgerMenuIsActive}
                  // We only add the link to the footer nav when javascript is not available
                  // The footer nav is always available in that scenario, but not necessarily when javascript is enabled
                  href={isEnhanced ? '/' : '#footer-nav-1'}
                  id="header-burger-trigger"
                  aria-label="menu"
                  onClick={event => {
                    event.preventDefault();
                    setBurgerMenuIsActive(!burgerMenuIsActive);
                  }}
                >
                  <span />
                  <span />
                  <span />
                </BurgerTrigger>
              </Burger>
              <HeaderBrand $isMinimalHeader={displayMinimalHeader}>
                {!inGallery ? (
                  <a href="/">
                    <WellcomeCollectionBlack />
                  </a>
                ) : (
                  <span>
                    <WellcomeCollectionBlack />
                  </span>
                )}
              </HeaderBrand>
              <NavLoginWrapper>
                {inGallery && currentUrl ? (
                  <HeaderNav
                    id="header-nav"
                    aria-labelledby="header-burger-trigger"
                    $burgerMenuisActive={burgerMenuIsActive}
                    $hasColorBackground={hasColorBackground}
                  >
                    <HeaderExhibitionNav currentUrl={currentUrl} />
                  </HeaderNav>
                ) : (
                  <HeaderNav
                    id="header-nav"
                    aria-labelledby="header-burger-trigger"
                    $burgerMenuisActive={burgerMenuIsActive}
                    $hasColorBackground={hasColorBackground}
                  >
                    <HeaderList className={font('brand-bold', -1)}>
                      {(customNavLinks || links).map((link, i) => (
                        <HeaderItem key={i}>
                          <HeaderLink
                            $burgerMenuisActive={
                              link.siteSection === siteSection
                            }
                            href={link.href}
                            {...(link.siteSection === siteSection
                              ? { 'aria-current': true }
                              : {})}
                          >
                            {link.title}
                          </HeaderLink>
                        </HeaderItem>
                      ))}
                    </HeaderList>
                    {!displayMinimalHeader && <MobileSignIn />}
                  </HeaderNav>
                )}

                <HeaderActions>
                  {!displayMinimalHeader && (
                    <>
                      {!isEnhanced ? (
                        <NextLink href="/search">
                          <NoJSIconWrapper>
                            <Icon
                              icon={searchDropdownIsActive ? cross : search}
                            />
                            <span className="visually-hidden">
                              {searchLabelText.overview}
                            </span>
                          </NoJSIconWrapper>
                        </NextLink>
                      ) : (
                        <SearchButton
                          text={
                            <Icon
                              icon={searchDropdownIsActive ? cross : search}
                            />
                          }
                          aria-label={
                            searchDropdownIsActive
                              ? 'Close search bar'
                              : 'Open search bar'
                          }
                          onClick={() => {
                            setSearchDropdownIsActive(
                              currentState => !currentState
                            );
                          }}
                          ref={searchButtonRef}
                        />
                      )}
                    </>
                  )}

                  {!displayMinimalHeader && <DesktopSignIn />}
                </HeaderActions>
              </NavLoginWrapper>
            </HeaderContainer>
          </div>
        </Wrapper>

        {!displayMinimalHeader && (
          <HeaderSearch
            isActive={searchDropdownIsActive}
            handleCloseModal={() => setSearchDropdownIsActive(false)}
            searchButtonRef={searchButtonRef}
            hasColorBackground={hasColorBackground}
          />
        )}
      </header>
    </FocusTrap>
  );
};

export default Header;
