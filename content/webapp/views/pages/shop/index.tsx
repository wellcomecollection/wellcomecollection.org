import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { FormEvent, useCallback, useState } from 'react';
import styled from 'styled-components';

import { PaginatedResults } from '@weco/common/services/prismic/types';
import { pluralize } from '@weco/common/utils/grammar';
import Divider from '@weco/common/views/components/Divider';
import {
  ContaineredLayout,
  gridSize12,
} from '@weco/common/views/components/Layout';
import PageHeader from '@weco/common/views/components/PageHeader';
import SearchBar from '@weco/common/views/components/SearchBar/SearchBar.Default';
import { Container } from '@weco/common/views/components/styled/Container';
import { Grid, GridCell } from '@weco/common/views/components/styled/Grid';
import PaginationWrapper from '@weco/common/views/components/styled/PaginationWrapper';
import Space from '@weco/common/views/components/styled/Space';
import SpacingSection from '@weco/common/views/components/styled/SpacingSection';
import PageLayout from '@weco/common/views/layouts/PageLayout';
import { ShopProductBasic } from '@weco/content/types/shop';
import Pagination from '@weco/content/views/components/Pagination';
import ShopSearchDropdown from '@weco/content/views/components/ShopSearchDropdown';

import ShopProductCard from './shop.ProductCard';

const SearchFormWrapper = styled.div`
  position: relative;
`;

const SHOP_SEARCH_FORM_ID = 'shop-search-form';

export type Props = {
  products: PaginatedResults<ShopProductBasic>;
  query?: string;
};

const ShopPage: NextPage<Props> = ({ products, query }) => {
  const router = useRouter();
  const [inputValue, setInputValue] = useState(query || '');
  const [showDropdown, setShowDropdown] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setShowDropdown(false);
    const trimmed = inputValue.trim();
    if (trimmed) {
      router.push({ pathname: '/shop', query: { query: trimmed } });
    } else {
      router.push('/shop');
    }
  };

  const handleInputChange = useCallback(
    (value: string) => {
      setInputValue(value);
      setShowDropdown(value.trim().length > 0);
    },
    [setInputValue]
  );

  const handleDropdownClose = useCallback(() => {
    setShowDropdown(false);
  }, []);

  return (
    <PageLayout
      title="Shop"
      description="Browse products from the Wellcome Collection shop."
      url={{ pathname: '/shop' }}
      jsonLd={{ '@type': 'WebPage' }}
      openGraphType="website"
    >
      <SpacingSection>
        <PageHeader
          variant="basic"
          breadcrumbs={{
            items: [{ text: 'Shop', url: '/shop' }],
          }}
          title="Shop"
          highlightHeading={true}
        />

        <ContaineredLayout gridSizes={gridSize12()}>
          <Space $v={{ size: 'lg', properties: ['margin-bottom'] }}>
            <SearchFormWrapper>
              <form id={SHOP_SEARCH_FORM_ID} onSubmit={handleSubmit}>
                <SearchBar
                  inputValue={inputValue}
                  setInputValue={handleInputChange}
                  placeholder="Search the shop"
                  form={SHOP_SEARCH_FORM_ID}
                  location="page"
                />
              </form>
              <ShopSearchDropdown
                query={inputValue}
                isVisible={showDropdown}
                onClose={handleDropdownClose}
              />
            </SearchFormWrapper>
          </Space>
        </ContaineredLayout>

        <ContaineredLayout gridSizes={gridSize12()}>
          <PaginationWrapper $verticalSpacing="md">
            <span>{pluralize(products.totalResults, 'result')}</span>

            {products.totalPages > 1 && (
              <Pagination
                totalPages={products.totalPages}
                ariaLabel="Results pagination"
                isHiddenMobile
              />
            )}
          </PaginationWrapper>

          <Space $v={{ size: 'md', properties: ['margin-bottom'] }}>
            <Divider />
          </Space>
        </ContaineredLayout>

        <Space $v={{ size: 'md', properties: ['margin-top'] }}>
          {products.results.length > 0 ? (
            <Container>
              <Grid>
                {products.results.map(product => (
                  <GridCell
                    key={product.id}
                    $sizeMap={{
                      s: [12],
                      m: [6],
                      l: [4],
                      xl: [4],
                    }}
                  >
                    <ShopProductCard product={product} />
                  </GridCell>
                ))}
              </Grid>
            </Container>
          ) : (
            <ContaineredLayout gridSizes={gridSize12()}>
              <p>
                {query
                  ? `No results for "${query}".`
                  : 'There are no products available.'}
              </p>
            </ContaineredLayout>
          )}
        </Space>

        {products.totalPages > 1 && (
          <ContaineredLayout gridSizes={gridSize12()}>
            <PaginationWrapper $verticalSpacing="md" $alignRight>
              <Pagination
                totalPages={products.totalPages}
                ariaLabel="Results pagination"
              />
            </PaginationWrapper>
          </ContaineredLayout>
        )}
      </SpacingSection>
    </PageLayout>
  );
};

export default ShopPage;
