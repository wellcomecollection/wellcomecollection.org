import { SliceComponentProps } from '@prismicio/react';
import { FunctionComponent } from 'react';

import {
  ArticlesDocument as RawArticlesDocument,
  CardListingSlice as RawCardListingSlice,
  SeriesDocument as RawSeriesDocument,
} from '@weco/common/prismicio-types';
import { isFilledLinkToDocumentWithData } from '@weco/common/services/prismic/types';
import { classNames, font } from '@weco/common/utils/classnames';
import { isNotUndefined } from '@weco/common/utils/type-guards';
import { Container } from '@weco/common/views/components/styled/Container';
import { Grid, GridCell } from '@weco/common/views/components/styled/Grid';
import Space from '@weco/common/views/components/styled/Space';
import SpacingComponent from '@weco/common/views/components/styled/SpacingComponent';
import {
  transformArticle,
  transformArticleToArticleBasic,
} from '@weco/content/services/prismic/transformers/articles';
import { transformSeries } from '@weco/content/services/prismic/transformers/series';
import { convertItemToCardProps } from '@weco/content/types/card';
import { SliceZoneContext } from '@weco/content/views/components/Body';
import Card from '@weco/content/views/components/Card';

type CardListingSliceProps = SliceComponentProps<
  RawCardListingSlice,
  SliceZoneContext
>;

const CardListingSlice: FunctionComponent<CardListingSliceProps> = ({
  slice,
}) => {
  const { title, description, itemsHaveTransparentBackground } = slice.primary;

  const cards = slice.items
    .map(item => {
      const { content } = item;
      if (!isFilledLinkToDocumentWithData(content)) return undefined;

      if (content.type === 'articles') {
        return convertItemToCardProps(
          transformArticleToArticleBasic(
            transformArticle(content as unknown as RawArticlesDocument)
          )
        );
      }
      if (content.type === 'series') {
        return convertItemToCardProps(
          transformSeries(content as unknown as RawSeriesDocument)
        );
      }
      return undefined;
    })
    .filter(isNotUndefined);

  if (cards.length === 0) return null;

  return (
    <SpacingComponent $sliceType={slice.slice_type}>
      <Container>
        {title && (
          <Space $v={{ size: 'sm', properties: ['margin-bottom'] }}>
            <h2 className={font('sans-bold', 2)}>{title}</h2>
          </Space>
        )}
        {description && (
          <Space $v={{ size: 'sm', properties: ['margin-bottom'] }}>
            <p className={font('sans', 0)}>{description}</p>
          </Space>
        )}
        <Grid>
          {cards.map((card, index) => (
            <GridCell
              key={index}
              className={classNames({
                'card-theme card-theme--transparent':
                  !!itemsHaveTransparentBackground,
              })}
              $sizeMap={{ s: [12], m: [6], l: [4], xl: [4] }}
            >
              <Card item={card} />
            </GridCell>
          ))}
        </Grid>
      </Container>
    </SpacingComponent>
  );
};

export default CardListingSlice;
