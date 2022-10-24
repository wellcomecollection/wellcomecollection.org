import CataloguePageLayout from 'components/CataloguePageLayout/CataloguePageLayout';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { FunctionComponent, ReactElement, useEffect, useState } from 'react';
import styled from 'styled-components';
import { pageDescriptions } from '@weco/common/data/microcopy';

const NavBar = styled.nav`
  border-bottom: 1px solid ${props => props.theme.color('warmNeutral.400')};
  [aria-current='page'] {
    &:after {
      width: 100%;
    }
  }
`;
const NavList = styled.ul`
  display: flex;
  list-style: none;
  list-style-position: inside;
  padding-inline-start: 0;
  margin-block-start: 0;
  margin-block-end: 0;
`;
const NavItem = styled.li`
  font-size: 1rem;
  font-size: 16px;
`;
const NavLink = styled.a`
  padding: 1.4rem 0.3rem;
  display: inline-block;
  text-decoration: none;
  position: relative;
  z-index: 1;
  white-space: nowrap;

  &:after {
    content: '';
    position: absolute;
    bottom: 0.1rem;
    height: 0.2rem;
    left: 0;
    width: 0;
    background: ${props => props.theme.color('yellow')};
    z-index: -1;
    transition: width ${props => props.theme.transitionProperties};
  }

  &:hover,
  &:focus {
    &:after {
      width: 100%;

      // Prevent iOS double-tap link issue
      // https://css-tricks.com/annoying-mobile-double-tap-link-issue/
      @media (pointer: coarse) {
        width: 0;
      }
    }
  }
`;

const SearchLayout: FunctionComponent = ({ children }) => {
  const router = useRouter();
  const currentSearchCategory =
    router.pathname === '/search'
      ? 'overview'
      : router.pathname.slice(router.pathname.lastIndexOf('/') + 1);

  const basePageMetadata = {
    openGraphType: 'website',
    siteSection: 'collections',
    jsonLd: { '@type': 'WebPage' },
    hideNewsletterPromo: true,
  } as const;

  const defaultPageLayoutMetadata = {
    ...basePageMetadata,
    title: 'Search Page',
    description: 'TBC',
    url: { pathname: '/search', query: {} },
  };

  const [pageLayoutMetadata, setPageLayoutMetadata] = useState(
    defaultPageLayoutMetadata
  );
  useEffect(() => {
    const { query } = router.query;
    switch (currentSearchCategory) {
      case 'overview':
        setPageLayoutMetadata(defaultPageLayoutMetadata);
        break;
      case 'exhibitions':
        setPageLayoutMetadata({
          ...basePageMetadata,
          description: 'copy pending',
          title: `${query ? `${query} | ` : ''}Exhibition Search`,
          url: { pathname: '/search/exhibitions', query: router.query },
        });
        break;
      case 'events':
        setPageLayoutMetadata({
          ...basePageMetadata,
          description: 'copy pending',
          title: `${query ? `${query} | ` : ''}Events Search`,
          url: { pathname: '/search/events', query: router.query },
        });
        break;
      case 'stories':
        setPageLayoutMetadata({
          ...basePageMetadata,
          description: 'copy pending',
          title: `${query ? `${query} | ` : ''}Stories Search`,
          url: { pathname: '/search/stories', query: router.query },
        });
        break;
      case 'images':
        setPageLayoutMetadata({
          ...basePageMetadata,
          description: pageDescriptions.images,
          title: `${query ? `${query} | ` : ''}Image Search`,
          url: { pathname: '/search/images', query: router.query },
        });
        break;
      case 'collections':
        setPageLayoutMetadata({
          ...basePageMetadata,
          description: 'copy pending',
          title: `${query ? `${query} | ` : ''}Collections Search`,
          url: { pathname: '/search/collections', query: router.query },
        });
        break;

      default:
        break;
    }
  }, [currentSearchCategory]);

  return (
    <CataloguePageLayout {...pageLayoutMetadata}>
      <div className="container">
        <input placeholder="search..." type="search" />
      </div>
      <NavBar aria-label="Search Categories">
        <div className="container">
          <NavList>
            <NavItem>
              <Link scroll={false} passHref href="/search">
                <NavLink
                  aria-current={
                    currentSearchCategory === 'overview' ? 'page' : 'false'
                  }
                >
                  Overview
                </NavLink>
              </Link>
            </NavItem>
            <NavItem>
              <Link scroll={false} passHref href="/search/exhibitions">
                <NavLink
                  aria-current={
                    currentSearchCategory === 'exhibitions' ? 'page' : 'false'
                  }
                >
                  Exhibitions
                </NavLink>
              </Link>
            </NavItem>
            <NavItem>
              <Link scroll={false} passHref href="/search/events">
                <NavLink
                  aria-current={
                    currentSearchCategory === 'events' ? 'page' : 'false'
                  }
                >
                  Events
                </NavLink>
              </Link>
            </NavItem>
            <NavItem>
              <Link scroll={false} passHref href="/search/stories">
                <NavLink
                  aria-current={
                    currentSearchCategory === 'stories' ? 'page' : 'false'
                  }
                >
                  Stories
                </NavLink>
              </Link>
            </NavItem>
            <NavItem>
              <Link scroll={false} passHref href="/search/images">
                <NavLink
                  aria-current={
                    currentSearchCategory === 'images' ? 'page' : 'false'
                  }
                >
                  Images
                </NavLink>
              </Link>
            </NavItem>
            <NavItem>
              <Link scroll={false} passHref href="/search/collections">
                <NavLink
                  aria-current={
                    currentSearchCategory === 'collections' ? 'page' : 'false'
                  }
                >
                  Collections
                </NavLink>
              </Link>
            </NavItem>
          </NavList>
        </div>
      </NavBar>

      {children}
    </CataloguePageLayout>
  );
};

export const getSearchLayout = (page: ReactElement): JSX.Element => (
  <SearchLayout>{page}</SearchLayout>
);

export default SearchLayout;
