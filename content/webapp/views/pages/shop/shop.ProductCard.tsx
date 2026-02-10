import { FunctionComponent } from 'react';
import styled from 'styled-components';

import { font } from '@weco/common/utils/classnames';
import LabelsList from '@weco/common/views/components/LabelsList';
import Space from '@weco/common/views/components/styled/Space';
import { ShopProductBasic } from '@weco/content/types/shop';

const CardLink = styled.a`
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
  background: ${props => props.theme.color('warmNeutral.300')};
  border-radius: ${props => props.theme.borderRadiusUnit}px;
  text-decoration: none;
  border: none;

  &:hover h3,
  &:focus h3 {
    text-decoration: underline;
    text-decoration-color: ${props => props.theme.color('black')};
  }
`;

const ImageWrapper = styled.div`
  position: relative;
  aspect-ratio: 1;
  overflow: hidden;
  background: ${props => props.theme.color('white')};
`;

const ProductImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: contain;
  display: block;
`;

const Title = styled(Space).attrs({
  as: 'h3',
  className: font('brand', 1),
  $v: { size: 'xs', properties: ['margin-bottom'] },
})`
  margin-top: 0;
`;

const Price = styled.p.attrs({
  className: font('sans-bold', -1),
})`
  margin: 0;
`;

const Description = styled.p.attrs({
  className: font('sans', -1),
})`
  margin: 0;
`;

function formatPrice(amount: string, currencyCode: string): string {
  const num = parseFloat(amount);
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: currencyCode,
  }).format(num);
}

type Props = {
  product: ShopProductBasic;
};

const ShopProductCard: FunctionComponent<Props> = ({ product }) => {
  const { title, description, featuredImage, priceRange, handle } = product;
  const minPrice = priceRange.minVariantPrice;
  const maxPrice = priceRange.maxVariantPrice;
  const hasVariantPrices = minPrice.amount !== maxPrice.amount;

  return (
    <CardLink href={`/shop/${handle}`} data-gtm-trigger="card_link">
      <ImageWrapper>
        {featuredImage && (
          <ProductImage
            src={featuredImage.url}
            alt=""
            width={featuredImage.width}
            height={featuredImage.height}
            loading="lazy"
          />
        )}
        <div style={{ position: 'absolute', bottom: 0 }}>
          <LabelsList labels={[{ text: 'Shop' }]} />
        </div>
      </ImageWrapper>

      <Space
        $v={{ size: 'sm', properties: ['padding-top', 'padding-bottom'] }}
        $h={{ size: 'sm', properties: ['padding-left', 'padding-right'] }}
        style={{ flex: 1 }}
      >
        <Title>{title}</Title>
        <Price>
          {hasVariantPrices
            ? `From ${formatPrice(minPrice.amount, minPrice.currencyCode)}`
            : formatPrice(minPrice.amount, minPrice.currencyCode)}
        </Price>
        {description && (
          <Space $v={{ size: 'xs', properties: ['margin-top'] }}>
            <Description>{description}</Description>
          </Space>
        )}
      </Space>
    </CardLink>
  );
};

export default ShopProductCard;
