import { NextPage } from 'next';

import { PaginatedResults } from '@weco/common/services/prismic/types';
import { pluralize } from '@weco/common/utils/grammar';
import Divider from '@weco/common/views/components/Divider';
import {
  ContaineredLayout,
  gridSize12,
} from '@weco/common/views/components/Layout';
import PageHeader from '@weco/common/views/components/PageHeader';
import { Container } from '@weco/common/views/components/styled/Container';
import { Grid, GridCell } from '@weco/common/views/components/styled/Grid';
import PaginationWrapper from '@weco/common/views/components/styled/PaginationWrapper';
import Space from '@weco/common/views/components/styled/Space';
import SpacingSection from '@weco/common/views/components/styled/SpacingSection';
import PageLayout from '@weco/common/views/layouts/PageLayout';
import { ShopProductBasic } from '@weco/content/types/shop';
import Pagination from '@weco/content/views/components/Pagination';

import ShopProductCard from './shop.ProductCard';

export type Props = {
  products: PaginatedResults<ShopProductBasic>;
};

const ShopPage: NextPage<Props> = ({ products }) => {
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

        {products.totalPages > 1 && (
          <ContaineredLayout gridSizes={gridSize12()}>
            <PaginationWrapper $verticalSpacing="md">
              <span>{pluralize(products.totalResults, 'result')}</span>

              <Pagination
                totalPages={products.totalPages}
                ariaLabel="Results pagination"
                isHiddenMobile
              />
            </PaginationWrapper>

            <Space $v={{ size: 'md', properties: ['margin-bottom'] }}>
              <Divider />
            </Space>
          </ContaineredLayout>
        )}

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
              <p>There are no products available.</p>
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
