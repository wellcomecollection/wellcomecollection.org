import { SliceComponentProps } from '@prismicio/react';
import { FunctionComponent } from 'react';

import {
  ArticlesDocument as RawArticlesDocument,
  CardListingSlice as RawCardListingSlice,
  SeriesDocument as RawSeriesDocument,
} from '@weco/common/prismicio-types';
import { isFilledLinkToDocumentWithData } from '@weco/common/services/prismic/types';
import { classNames } from '@weco/common/utils/classnames';
import { isNotUndefined } from '@weco/common/utils/type-guards';
import ConditionalWrapper from '@weco/common/views/components/ConditionalWrapper';
import { Container } from '@weco/common/views/components/styled/Container';
import { Grid, GridCell } from '@weco/common/views/components/styled/Grid';
import Space from '@weco/common/views/components/styled/Space';
import SpacingComponent from '@weco/common/views/components/styled/SpacingComponent';
import {
  transformArticle,
  transformArticleToArticleBasic,
} from '@weco/content/services/prismic/transformers/articles';
import { transformSeries } from '@weco/content/services/prismic/transformers/series';
import { ArticleBasic } from '@weco/content/types/articles';
import {
  Card as CardType,
  convertItemToCardProps,
} from '@weco/content/types/card';
import { SliceZoneContext } from '@weco/content/views/components/Body';
import Card from '@weco/content/views/components/Card';
import SectionHeader from '@weco/content/views/components/SectionHeader';
import StoryCard from '@weco/content/views/components/StoryCard';

type CardListingSliceProps = SliceComponentProps<
  RawCardListingSlice,
  SliceZoneContext
>;

type ArticleItem = { type: 'article'; data: ArticleBasic };
type SeriesItem = { type: 'series'; data: CardType };
type CardListingItem = ArticleItem | SeriesItem;

const CardListingSlice: FunctionComponent<CardListingSliceProps> = ({
  slice,
  context,
}) => {
  const { title, description } = slice.primary;
  const hasContainer = context?.hasContainer ?? false;
  const itemsHaveTransparentBackground =
    context?.itemsHaveTransparentBackground ?? false;
  const cardSizeMap = context?.cardSizeMap ?? {
    s: [12],
    m: [6],
    l: [4],
    xl: [4],
  };

  const items: CardListingItem[] = slice.items
    .map((item): CardListingItem | undefined => {
      const { content } = item;
      if (!isFilledLinkToDocumentWithData(content)) return undefined;

      if (content.type === 'articles') {
        return {
          type: 'article',
          data: transformArticleToArticleBasic(
            transformArticle(content as unknown as RawArticlesDocument)
          ),
        };
      }
      if (content.type === 'series') {
        return {
          type: 'series',
          data: convertItemToCardProps(
            transformSeries(content as unknown as RawSeriesDocument)
          ),
        };
      }
      return undefined;
    })
    .filter(isNotUndefined);

  if (items.length === 0) return null;

  return (
    <SpacingComponent $sliceType={slice.slice_type}>
      <ConditionalWrapper
        condition={!hasContainer}
        wrapper={children => <Container>{children}</Container>}
      >
        {title && (
          <Space $v={{ size: 'md', properties: ['margin-bottom'] }}>
            <SectionHeader title={title} />
          </Space>
        )}
        {description && (
          <Space $v={{ size: 'md', properties: ['margin-bottom'] }}>
            <p>{description}</p>
          </Space>
        )}
        <Grid>
          {items.map((item, index) => (
            <GridCell
              key={index}
              className={classNames({
                'card-theme card-theme--transparent':
                  !!itemsHaveTransparentBackground,
              })}
              $sizeMap={cardSizeMap}
            >
              {item.type === 'article' ? (
                <StoryCard
                  variant="prismic"
                  article={item.data}
                  showAllLabels
                  positionInList={index + 1}
                />
              ) : (
                <Card item={item.data} positionInList={index + 1} />
              )}
            </GridCell>
          ))}
        </Grid>
      </ConditionalWrapper>
    </SpacingComponent>
  );
};

export default CardListingSlice;
