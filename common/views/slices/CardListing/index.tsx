import { SliceComponentProps } from '@prismicio/react';
import { FunctionComponent } from 'react';

import {
  ArticlesDocument as RawArticlesDocument,
  CardListingSlice as RawCardListingSlice,
  SeriesDocument as RawSeriesDocument,
} from '@weco/common/prismicio-types';
import { isFilledLinkToDocumentWithData } from '@weco/common/services/prismic/types';
import { classNames, typography } from '@weco/common/utils/classnames';
import { isNotUndefined } from '@weco/common/utils/type-guards';
import ConditionalWrapper from '@weco/common/views/components/ConditionalWrapper';
import { gridSize12 } from '@weco/common/views/components/Layout';
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
import FeaturedCard, {
  convertCardToFeaturedCardProps,
  convertItemToFeaturedCardProps,
} from '@weco/content/views/components/FeaturedCard';
import SectionHeader from '@weco/content/views/components/SectionHeader';
import StoryCard from '@weco/content/views/components/StoryCard';

type CardListingSliceProps = SliceComponentProps<
  RawCardListingSlice,
  SliceZoneContext
>;

type ArticleItem = { type: 'article'; id: string; data: ArticleBasic };
type SeriesItem = { type: 'series'; id: string; data: CardType };
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
  const isFirstCardFeatured = context?.isFirstCardFeatured ?? false;

  const items: CardListingItem[] = slice.items
    .map((item): CardListingItem | undefined => {
      const { content } = item;
      if (!isFilledLinkToDocumentWithData(content)) return undefined;

      if (content.type === 'articles') {
        return {
          type: 'article',
          id: content.id,
          data: transformArticleToArticleBasic(
            transformArticle(content as unknown as RawArticlesDocument)
          ),
        };
      }
      if (content.type === 'series') {
        return {
          type: 'series',
          id: content.id,
          data: convertItemToCardProps(
            transformSeries(content as unknown as RawSeriesDocument)
          ),
        };
      }
      return undefined;
    })
    .filter(isNotUndefined);

  if (items.length === 0) return null;

  const [firstItem, ...restItems] = items;
  const featuredItem = isFirstCardFeatured ? firstItem : undefined;
  const gridItems = isFirstCardFeatured ? restItems : items;

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
        {featuredItem && (
          <Space $v={{ size: 'md', properties: ['margin-bottom'] }}>
            <Grid>
              <GridCell $sizeMap={gridSize12()}>
                <FeaturedCard
                  {...(featuredItem.type === 'article'
                    ? convertItemToFeaturedCardProps(featuredItem.data)
                    : convertCardToFeaturedCardProps(featuredItem.data))}
                  background="black"
                  textColor="white"
                >
                  <h3
                    className={typography('heading', 'xl', 'strong', 'brand')}
                  >
                    {featuredItem.data.title}
                  </h3>
                  {featuredItem.type === 'series' &&
                    featuredItem.data.description && (
                      <p className={typography('body', 'md', 'regular')}>
                        {featuredItem.data.description}
                      </p>
                    )}
                  {featuredItem.type === 'article' &&
                    featuredItem.data.promo?.caption && (
                      <p className={typography('body', 'md', 'regular')}>
                        {featuredItem.data.promo.caption}
                      </p>
                    )}
                </FeaturedCard>
              </GridCell>
            </Grid>
          </Space>
        )}
        {gridItems.length > 0 && (
          <Grid>
            {gridItems.map((item, index) => {
              const positionInList = isFirstCardFeatured
                ? index + 2
                : index + 1;
              return (
                <GridCell
                  key={item.id}
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
                      positionInList={positionInList}
                    />
                  ) : (
                    <Card item={item.data} positionInList={positionInList} />
                  )}
                </GridCell>
              );
            })}
          </Grid>
        )}
      </ConditionalWrapper>
    </SpacingComponent>
  );
};

export default CardListingSlice;
