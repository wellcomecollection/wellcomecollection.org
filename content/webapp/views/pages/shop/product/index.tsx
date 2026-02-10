import { NextPage } from 'next';
import { useState } from 'react';
import styled from 'styled-components';

import { font } from '@weco/common/utils/classnames';
import Button from '@weco/common/views/components/Buttons';
import {
  ContaineredLayout,
  gridSize8,
} from '@weco/common/views/components/Layout';
import PageHeader from '@weco/common/views/components/PageHeader';
import Space from '@weco/common/views/components/styled/Space';
import SpacingSection from '@weco/common/views/components/styled/SpacingSection';
import PageLayout from '@weco/common/views/layouts/PageLayout';
import { useCartContext } from '@weco/content/contexts/CartContext';
import { ShopProduct, ShopProductVariant } from '@weco/content/types/shop';

const ProductImage = styled.img`
  width: 100%;
  height: auto;
  display: block;
  border-radius: ${props => props.theme.borderRadiusUnit}px;
`;

const Price = styled.p.attrs({
  className: font('sans-bold', 2),
})`
  margin: 0;
`;

const Description = styled.div.attrs({
  className: font('sans', 0),
})`
  p {
    margin-top: 0;
  }
`;

const UnavailableMessage = styled.p.attrs({
  className: font('sans', 0),
})`
  color: ${props => props.theme.color('neutral.600')};
`;

const VariantButton = styled.button<{ $isSelected: boolean }>`
  padding: 8px 16px;
  border: 2px solid
    ${props =>
      props.$isSelected
        ? props.theme.color('black')
        : props.theme.color('neutral.400')};
  border-radius: ${props => props.theme.borderRadiusUnit}px;
  background: ${props =>
    props.$isSelected
      ? props.theme.color('warmNeutral.300')
      : props.theme.color('white')};
  cursor: pointer;
  transition: border-color 0.15s ease;

  &:hover {
    border-color: ${props => props.theme.color('black')};
  }
`;

const VariantLabel = styled.span.attrs({
  className: font('sans-bold', -1),
})``;

const VariantList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

function formatPrice(amount: string, currencyCode: string): string {
  const num = parseFloat(amount);
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: currencyCode,
  }).format(num);
}

export type Props = {
  product: ShopProduct;
};

const hasMultipleVariants = (variants: ShopProductVariant[]): boolean =>
  variants.length > 1 ||
  (variants.length === 1 && variants[0].title !== 'Default Title');

const ShopProductPage: NextPage<Props> = ({ product }) => {
  const [selectedVariant, setSelectedVariant] = useState(product.variants[0]);
  const { addItem, setIsOpen } = useCartContext();

  const handleAddToCart = () => {
    if (!selectedVariant) return;

    addItem({
      variantId: selectedVariant.id,
      productHandle: product.handle,
      title: product.title,
      variantTitle: selectedVariant.title,
      price: selectedVariant.price,
      quantity: 1,
      image: product.featuredImage,
    });

    setIsOpen(true);
  };

  return (
    <PageLayout
      title={product.title}
      description={product.description}
      url={{ pathname: `/shop/${product.handle}` }}
      jsonLd={{ '@type': 'Product' }}
      openGraphType="website"
    >
      <SpacingSection>
        <PageHeader
          variant="basic"
          breadcrumbs={{
            items: [
              { text: 'Shop', url: '/shop' },
              {
                text: product.title,
                url: `/shop/${product.handle}`,
                isHidden: true,
              },
            ],
          }}
          title={product.title}
        />

        <ContaineredLayout gridSizes={gridSize8()}>
          {product.featuredImage && (
            <Space $v={{ size: 'md', properties: ['margin-bottom'] }}>
              <ProductImage
                src={product.featuredImage.url}
                alt={product.featuredImage.altText || product.title}
                width={product.featuredImage.width}
                height={product.featuredImage.height}
              />
            </Space>
          )}

          <Space $v={{ size: 'md', properties: ['margin-top'] }}>
            <Price>
              {selectedVariant
                ? formatPrice(
                    selectedVariant.price.amount,
                    selectedVariant.price.currencyCode
                  )
                : formatPrice(
                    product.priceRange.minVariantPrice.amount,
                    product.priceRange.minVariantPrice.currencyCode
                  )}
            </Price>
          </Space>

          {hasMultipleVariants(product.variants) && (
            <Space $v={{ size: 'md', properties: ['margin-top'] }}>
              <VariantList>
                {product.variants.map(variant => (
                  <VariantButton
                    key={variant.id}
                    $isSelected={selectedVariant?.id === variant.id}
                    onClick={() => setSelectedVariant(variant)}
                    disabled={!variant.availableForSale}
                    aria-label={`Select ${variant.title}`}
                    aria-pressed={selectedVariant?.id === variant.id}
                  >
                    <VariantLabel>{variant.title}</VariantLabel>
                  </VariantButton>
                ))}
              </VariantList>
            </Space>
          )}

          {product.descriptionHtml && (
            <Space $v={{ size: 'md', properties: ['margin-top'] }}>
              <Description
                dangerouslySetInnerHTML={{ __html: product.descriptionHtml }}
              />
            </Space>
          )}

          <Space $v={{ size: 'lg', properties: ['margin-top'] }}>
            {product.availableForSale && selectedVariant?.availableForSale ? (
              <Button
                variant="ButtonSolid"
                clickHandler={handleAddToCart}
                text="Add to cart"
              />
            ) : (
              <UnavailableMessage>
                {selectedVariant &&
                !selectedVariant.availableForSale &&
                hasMultipleVariants(product.variants)
                  ? 'This variant is currently unavailable.'
                  : 'This product is out of stock.'}
              </UnavailableMessage>
            )}
          </Space>
        </ContaineredLayout>
      </SpacingSection>
    </PageLayout>
  );
};

export default ShopProductPage;
