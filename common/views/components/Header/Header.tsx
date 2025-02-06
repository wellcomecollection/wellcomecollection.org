import { FocusTrap } from 'focus-trap-react';
import NextLink from 'next/link';
import {
  FunctionComponent,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import styled from 'styled-components';

import { prismicPageIds } from '@weco/common/data/hardcoded-ids';
import { searchLabelText } from '@weco/common/data/microcopy';
import { cross, search } from '@weco/common/icons';
import WellcomeCollectionBlack from '@weco/common/icons/wellcome_collection_black';
import { SiteSection } from '@weco/common/model/site-section';
import { useToggles } from '@weco/common/server-data/Context';
import { font } from '@weco/common/utils/classnames';
import { AppContext } from '@weco/common/views/components/AppContext/AppContext';
import Icon from '@weco/common/views/components/Icon/Icon';

import DesktopSignIn from './DesktopSignIn';
import {
  Burger,
  BurgerTrigger,
  GridCell,
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
import HeaderSearch from './HeaderSearch';
import MobileSignIn from './MobileSignIn';

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
  // We don't display login and search on certain pages, e.g. exhibition guides
  isMinimalHeader = false,
}) => {
  const [burgerMenuIsActive, setBurgerMenuIsActive] = useState(false);
  const [searchDropdownIsActive, setSearchDropdownIsActive] = useState(false);
  const searchButtonRef = useRef<HTMLButtonElement>(null);
  const { isEnhanced } = useContext(AppContext);
  const { allSearch } = useToggles();

  useEffect(() => {
    if (document && document.documentElement) {
      if (searchDropdownIsActive || burgerMenuIsActive) {
        document.documentElement.classList.add('is-scroll-locked');
        document.getElementById('global-search-input')?.focus();
      } else {
        document.documentElement.classList.remove('is-scroll-locked');
      }
    }

    return () => {
      document.documentElement.classList.remove('is-scroll-locked');
    };
  }, [searchDropdownIsActive, burgerMenuIsActive]);

  return (
    <FocusTrap
      active={searchDropdownIsActive || burgerMenuIsActive}
      focusTrapOptions={{ preventScroll: true }}
    >
      <header className="is-hidden-print">
        <Wrapper $isBurgerOpen={burgerMenuIsActive}>
          <GridCell>
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
              <HeaderBrand $isMinimalHeader={isMinimalHeader}>
                <a href="/">
                  <WellcomeCollectionBlack />
                </a>
              </HeaderBrand>
              <NavLoginWrapper>
                <HeaderNav
                  $burgerMenuisActive={burgerMenuIsActive}
                  id="header-nav"
                  aria-labelledby="header-burger-trigger"
                >
                  <HeaderList className={font('wb', 5)}>
                    {(customNavLinks || links).map((link, i) => (
                      <HeaderItem key={i}>
                        <HeaderLink
                          $burgerMenuisActive={link.siteSection === siteSection}
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
                  {!isMinimalHeader && <MobileSignIn />}
                </HeaderNav>

                <HeaderActions>
                  {!isMinimalHeader && (
                    <>
                      {!isEnhanced ? (
                        <NextLink href="/search" passHref>
                          <NoJSIconWrapper>
                            <Icon
                              icon={searchDropdownIsActive ? cross : search}
                            />
                            <span className="visually-hidden">
                              {allSearch
                                ? searchLabelText.overviewAllSearch
                                : searchLabelText.overview}
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

                  {!isMinimalHeader && <DesktopSignIn />}
                </HeaderActions>
              </NavLoginWrapper>
            </HeaderContainer>
          </GridCell>
        </Wrapper>

        {!isMinimalHeader && (
          <HeaderSearch
            isActive={searchDropdownIsActive}
            handleCloseModal={() => setSearchDropdownIsActive(false)}
            searchButtonRef={searchButtonRef}
          />
        )}
      </header>
    </FocusTrap>
  );
};

export default Header;
