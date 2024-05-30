import {
  ReactElement,
  FunctionComponent,
  Fragment,
  PropsWithChildren,
} from 'react';
import { ContentListSlice } from '@weco/common/prismicio-types';
import styled from 'styled-components';
import { classNames, font } from '@weco/common/utils/classnames';
import { Link } from '../../types/link';
import { defaultSerializer } from '../HTMLSerializers/HTMLSerializers';
import SpacingComponent from '@weco/common/views/components/styled/SpacingComponent';
import SectionHeader from '@weco/content/components/SectionHeader/SectionHeader';
import Space from '@weco/common/views/components/styled/Space';
import FeaturedText from '../FeaturedText/FeaturedText';
import Layout, {
  gridSize12,
  gridSize10,
  gridSize8,
} from '@weco/common/views/components/Layout';
import OnThisPageAnchors from '../OnThisPageAnchors/OnThisPageAnchors';
import { WobblyEdge } from '@weco/common/views/components/WobblyEdge';
import GridFactory, { sectionLevelPageGrid } from './GridFactory';
import Card from '../Card/Card';
import { convertItemToCardProps } from '../../types/card';
import { isContentList } from '../../types/body';
import FeaturedCard, {
  convertItemToFeaturedCardProps,
  convertCardToFeaturedCardProps,
} from '../FeaturedCard/FeaturedCard';
import * as prismic from '@prismicio/client';
import { Props as ComicPreviousNextProps } from '../ComicPreviousNext/ComicPreviousNext';
import { PaletteColor } from '@weco/common/views/themes/config';
import { SliceZone } from '@prismicio/react';
import { components } from '@weco/common/views/slices';
import { transformContentListSlice } from '@weco/content/services/prismic/transformers/body';

const BodyWrapper = styled.div<{ $splitBackground: boolean }>`
  ${props =>
    props.$splitBackground &&
    `
  > div:first-child {
    background: linear-gradient(180deg, ${props.theme.color(
      'white'
    )} 50%, transparent 50%);
  }
`}
`;

type LayoutWidthProps = PropsWithChildren<{
  width: 8 | 10 | 12;
}>;

export const LayoutWidth: FunctionComponent<LayoutWidthProps> = ({
  width,
  children,
}): ReactElement | null => {
  switch (true) {
    case width === 12:
      return <Layout gridSizes={gridSize12()}>{children}</Layout>;
    case width === 10:
      return <Layout gridSizes={gridSize10()}>{children}</Layout>;
    case width === 8:
      return <Layout gridSizes={gridSize8()}>{children}</Layout>;
    default:
      return null;
  }
};

export type Props = {
  untransformedBody: prismic.Slice[];
  onThisPage?: Link[];
  showOnThisPage?: boolean;
  isDropCapped?: boolean;
  pageId: string;
  minWidth?: 10 | 8;
  isLanding?: boolean;
  sectionLevelPage?: boolean;
  staticContent?: ReactElement | null;
  comicPreviousNext?: ComicPreviousNextProps;
  contentType?: 'short-film' | 'visual-story' | 'standalone-image-gallery';
};

type SectionTheme = {
  rowBackground: PaletteColor;
  cardBackground: PaletteColor;
  featuredCardBackground: PaletteColor;
  featuredCardText: PaletteColor;
};

type WrapperProps = {
  $cardBackgroundColor: PaletteColor;
  $rowBackgroundColor: PaletteColor;
};
const Wrapper = styled(Space).attrs<WrapperProps>(props => ({
  className: classNames({
    'row card-theme': true,
    'bg-dark': props.$rowBackgroundColor === 'neutral.700',
    [`card-theme--${props.$cardBackgroundColor}`]: [
      'white',
      'transparent',
    ].includes(props.$cardBackgroundColor),
  }),
}))<{ $rowBackgroundColor: PaletteColor }>`
  background-color: ${props => props.theme.color(props.$rowBackgroundColor)};
`;

export type SliceZoneContext = {
  minWidth: 8 | 10 | 12;
  firstTextSliceIndex: number;
  isVisualStory: boolean;
  comicPreviousNext?: ComicPreviousNextProps;
  isShortFilm: boolean;
  pageId: string;
  isLanding: boolean;
  isDropCapped: boolean;
  contentType?: 'short-film' | 'visual-story' | 'standalone-image-gallery';
};

export const defaultContext: SliceZoneContext = {
  minWidth: 8,
  firstTextSliceIndex: 1,
  isVisualStory: false,
  comicPreviousNext: undefined,
  isShortFilm: false,
  pageId: '',
  isLanding: false,
  isDropCapped: false,
  contentType: undefined,
};

const Body: FunctionComponent<Props> = ({
  untransformedBody,
  onThisPage,
  showOnThisPage,
  isDropCapped,
  pageId,
  minWidth = 8,
  isLanding = false,
  sectionLevelPage = false,
  staticContent = null,
  comicPreviousNext,
  contentType,
}: Props) => {
  const isFirstFeaturedTextSliceFromUntransformedBody = (slice, i) =>
    i === 0 && slice.slice_type === 'text' && slice.slice_label === 'featured';

  const featuredTextFromUntransformedBody = untransformedBody.find(
    isFirstFeaturedTextSliceFromUntransformedBody
  ) as prismic.Slice<'text', { text: prismic.RichTextField }>;

  const filteredUntransformedBody = untransformedBody
    .filter(
      (slice, i) => !isFirstFeaturedTextSliceFromUntransformedBody(slice, i)
    )
    .filter(
      slice =>
        !(
          slice.slice_type === 'editorialImage' &&
          slice.slice_label === 'featured'
        )
    )
    .filter(slice => slice.slice_type !== 'standfirst');

  const firstTextSliceIndex = filteredUntransformedBody
    .map(slice => slice.slice_type)
    .indexOf('text');

  const sections: ContentListSlice[] = untransformedBody.filter(isContentList);

  const sectionThemes: SectionTheme[] = [
    {
      rowBackground: 'white',
      cardBackground: 'warmNeutral.300',
      featuredCardBackground: 'neutral.700',
      featuredCardText: 'white',
    },
    {
      rowBackground: 'warmNeutral.300',
      cardBackground: 'white',
      featuredCardBackground: 'white',
      featuredCardText: 'black',
    },
    {
      rowBackground: 'white',
      cardBackground: 'warmNeutral.300',
      featuredCardBackground: 'warmNeutral.300',
      featuredCardText: 'black',
    },
    {
      rowBackground: 'neutral.700',
      cardBackground: 'transparent',
      featuredCardBackground: 'white',
      featuredCardText: 'black',
    },
  ];

  const LandingPageSections: FunctionComponent<{
    sections: ContentListSlice[];
  }> = ({ sections = [] }) => (
    <>
      {sections.map((untransformedSection, index) => {
        const section = transformContentListSlice(untransformedSection);
        const isFirst = index === 0;
        const isLast = index === sections.length - 1;
        const sectionTheme = sectionThemes[index % sectionThemes.length];
        const hasFeatured = section.value.items.length === 1;
        const firstItem = section.value.items?.[0];
        const isCardType = firstItem?.type === 'card';

        const firstItemProps =
          firstItem &&
          (isCardType
            ? convertCardToFeaturedCardProps(firstItem)
            : convertItemToFeaturedCardProps(firstItem));

        const cardItems = hasFeatured
          ? section.value.items.slice(1)
          : section.value.items;
        const featuredItem =
          hasFeatured && firstItem ? (
            <FeaturedCard
              {...firstItemProps}
              background={sectionTheme.featuredCardBackground}
              textColor={sectionTheme.featuredCardText}
              isReversed={false}
            >
              <h3 className={font('wb', 2)}>{firstItem.title}</h3>
              {isCardType && firstItem.description && (
                <p className={font('intr', 5)}>{firstItem.description}</p>
              )}
              {'promo' in firstItem && firstItem.promo && (
                <p className={font('intr', 5)}>{firstItem.promo.caption}</p>
              )}
            </FeaturedCard>
          ) : null;

        const cards = cardItems.map((item, i) => {
          const cardProps =
            item.type === 'card' ? item : convertItemToCardProps(item);
          return <Card key={i} item={cardProps} />;
        });

        return (
          <Fragment key={index}>
            {!isFirst && (
              <WobblyEdge
                backgroundColor={sectionTheme.rowBackground}
                isStatic
              />
            )}
            <Wrapper
              $v={{
                size: 'xl',
                properties:
                  isLast && sectionTheme.rowBackground === 'white'
                    ? ['padding-top']
                    : isFirst && sectionTheme.rowBackground === 'white'
                    ? ['padding-bottom']
                    : ['padding-top', 'padding-bottom'],
              }}
              $cardBackgroundColor={sectionTheme.cardBackground}
              $rowBackgroundColor={sectionTheme.rowBackground}
            >
              {section.value.title && (
                <Space $v={{ size: 'l', properties: ['margin-bottom'] }}>
                  <SectionHeader title={section.value.title} />
                </Space>
              )}
              {featuredItem && (
                <Space $v={{ size: 'l', properties: ['margin-bottom'] }}>
                  <Layout gridSizes={gridSize12()}>{featuredItem}</Layout>
                </Space>
              )}
              {cards.length > 0 && (
                <GridFactory
                  items={cards}
                  overrideGridSizes={
                    sectionLevelPage ? sectionLevelPageGrid : undefined
                  }
                />
              )}
            </Wrapper>
            {!isLast && <WobblyEdge backgroundColor="white" isStatic />}
          </Fragment>
        );
      })}
    </>
  );

  const isShortFilm = contentType === 'short-film';
  const isVisualStory = contentType === 'visual-story';

  return (
    <BodyWrapper
      className={`content-type-${contentType}`}
      $splitBackground={isShortFilm}
    >
      {featuredTextFromUntransformedBody && (
        <Layout gridSizes={gridSize8(!sectionLevelPage)}>
          <div className="body-text spaced-text">
            <Space
              $v={{
                size: sectionLevelPage ? 'xl' : 'l',
                properties: ['margin-bottom'],
              }}
            >
              <FeaturedText
                html={featuredTextFromUntransformedBody.primary.text}
                htmlSerializer={defaultSerializer}
              />
            </Space>
          </div>
        </Layout>
      )}

      {staticContent}

      {onThisPage && onThisPage.length > 2 && showOnThisPage && (
        <SpacingComponent>
          <LayoutWidth width={minWidth}>
            <OnThisPageAnchors links={onThisPage} />
          </LayoutWidth>
        </SpacingComponent>
      )}

      {isLanding && <LandingPageSections sections={sections} />}

      <SliceZone
        slices={filteredUntransformedBody}
        components={components}
        context={{
          minWidth,
          firstTextSliceIndex,
          isVisualStory,
          comicPreviousNext,
          pageId,
          isLanding,
          isDropCapped,
          contentType,
        }}
      />
    </BodyWrapper>
  );
};

export default Body;
