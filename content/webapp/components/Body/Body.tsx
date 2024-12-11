import * as prismic from '@prismicio/client';
import { SliceZone } from '@prismicio/react';
import {
  Fragment,
  FunctionComponent,
  PropsWithChildren,
  ReactElement,
} from 'react';
import styled from 'styled-components';

import { ContentListSlice as RawContentListSlice } from '@weco/common/prismicio-types';
import { classNames, font } from '@weco/common/utils/classnames';
import {
  ContaineredLayout,
  gridSize10,
  gridSize12,
  gridSize8,
} from '@weco/common/views/components/Layout';
import Space from '@weco/common/views/components/styled/Space';
import SpacingComponent from '@weco/common/views/components/styled/SpacingComponent';
import { WobblyEdge } from '@weco/common/views/components/WobblyEdge';
import { components } from '@weco/common/views/slices';
import { PaletteColor } from '@weco/common/views/themes/config';
import Card from '@weco/content/components/Card/Card';
import { Props as ComicPreviousNextProps } from '@weco/content/components/ComicPreviousNext/ComicPreviousNext';
import FeaturedCard, {
  convertCardToFeaturedCardProps,
  convertItemToFeaturedCardProps,
} from '@weco/content/components/FeaturedCard';
import FeaturedText from '@weco/content/components/FeaturedText/FeaturedText';
import { defaultSerializer } from '@weco/content/components/HTMLSerializers/HTMLSerializers';
import OnThisPageAnchors from '@weco/content/components/OnThisPageAnchors/OnThisPageAnchors';
import SectionHeader from '@weco/content/components/SectionHeader/SectionHeader';
import { transformContentListSlice } from '@weco/content/services/prismic/transformers/body';
import { isContentList } from '@weco/content/types/body';
import { convertItemToCardProps } from '@weco/content/types/card';
import { Link } from '@weco/content/types/link';

import GridFactory, { sectionLevelPageGrid } from './GridFactory';

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
      return (
        <ContaineredLayout gridSizes={gridSize12()}>
          {children}
        </ContaineredLayout>
      );
    case width === 10:
      return (
        <ContaineredLayout gridSizes={gridSize10()}>
          {children}
        </ContaineredLayout>
      );
    case width === 8:
      return (
        <ContaineredLayout gridSizes={gridSize8()}>
          {children}
        </ContaineredLayout>
      );
    default:
      return null;
  }
};

export type Props = {
  untransformedBody: prismic.Slice[];
  introText?: prismic.RichTextField;
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
  hasRecommendations?: boolean;
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
  firstTextSliceIndex: string;
  isVisualStory: boolean;
  comicPreviousNext?: ComicPreviousNextProps;
  isShortFilm: boolean;
  pageId: string;
  isLanding: boolean;
  isDropCapped: boolean;
  contentType?: 'short-film' | 'visual-story' | 'standalone-image-gallery';
  fifthParagraphIndex?: number;
};

export const defaultContext: SliceZoneContext = {
  minWidth: 8,
  firstTextSliceIndex: '',
  isVisualStory: false,
  comicPreviousNext: undefined,
  isShortFilm: false,
  pageId: '',
  isLanding: false,
  isDropCapped: false,
  contentType: undefined,
};

const TransformedSliceZone = ({ slices, components, context }) => {
  let paragraphCount = 0;
  let hasFoundFifthParagraph = false;
  let index;

  return slices.map(slice => {
    let isTheSliceWFifthParagraph = false;

    if (slice.slice_type === 'text') {
      // Go through all Text slices
      if (
        !hasFoundFifthParagraph &&
        paragraphCount <= 5 &&
        Array.isArray(slice.primary?.text)
      ) {
        // Find all paragraphs within each Text slice until we find the fifth one.
        slice.primary?.text.forEach((t, textIndex) => {
          if (
            !hasFoundFifthParagraph &&
            paragraphCount <= 5 &&
            t.type === 'paragraph'
          ) {
            if (paragraphCount < 5) {
              paragraphCount++;
            } else {
              index = textIndex;
              hasFoundFifthParagraph = true;
              isTheSliceWFifthParagraph = true;
            }
          }
        });
      }

      return (
        <SliceZone
          key={slice.id}
          slices={[slice]}
          components={components}
          context={{
            ...context,
            fifthParagraphIndex: isTheSliceWFifthParagraph ? index : undefined,
          }}
        />
      );
    }

    return (
      <SliceZone
        key={slice.id}
        slices={[slice]}
        components={components}
        context={context}
      />
    );
  });
};

const Body: FunctionComponent<Props> = ({
  untransformedBody,
  introText,
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
  hasRecommendations,
}: Props) => {
  const filteredUntransformedBody = untransformedBody.filter(
    slice => slice.slice_type !== 'standfirst'
  );

  const firstTextSliceIndex =
    filteredUntransformedBody.find(slice => slice.slice_type === 'text')?.id ||
    '';

  const sections: RawContentListSlice[] =
    untransformedBody.filter(isContentList);

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
    sections: RawContentListSlice[];
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
                  <SectionHeader
                    title={section.value.title}
                    gridSize={sectionLevelPage ? gridSize12() : gridSize8()}
                  />
                </Space>
              )}
              {featuredItem && (
                <Space $v={{ size: 'l', properties: ['margin-bottom'] }}>
                  <ContaineredLayout gridSizes={gridSize12()}>
                    {featuredItem}
                  </ContaineredLayout>
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
      {introText && (
        <ContaineredLayout gridSizes={gridSize8(!sectionLevelPage)}>
          <div className="body-text spaced-text">
            <Space
              $v={{
                size: sectionLevelPage ? 'xl' : 'l',
                properties: ['margin-bottom'],
              }}
            >
              <FeaturedText
                html={introText}
                htmlSerializer={defaultSerializer}
              />
            </Space>
          </div>
        </ContaineredLayout>
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

      {hasRecommendations ? (
        <TransformedSliceZone
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
            isShortFilm,
            hasRecommendations,
          }}
        />
      ) : (
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
            isShortFilm,
          }}
        />
      )}
    </BodyWrapper>
  );
};

export default Body;
