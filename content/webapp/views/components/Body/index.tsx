import * as prismic from '@prismicio/client';
import { SliceZone } from '@prismicio/react';
import {
  Fragment,
  FunctionComponent,
  PropsWithChildren,
  ReactElement,
} from 'react';
import styled from 'styled-components';

import { officialLandingPagesUid } from '@weco/common/data/hardcoded-ids';
import { ContentListSlice as RawContentListSlice } from '@weco/common/prismicio-types';
import { useToggles } from '@weco/common/server-data/Context';
import { classNames, font } from '@weco/common/utils/classnames';
import DecorativeEdge from '@weco/common/views/components/DecorativeEdge';
import { defaultSerializer } from '@weco/common/views/components/HTMLSerializers';
import {
  ContaineredLayout,
  gridSize10,
  gridSize12,
  gridSize8,
} from '@weco/common/views/components/Layout';
import { Grid, GridCell } from '@weco/common/views/components/styled/Grid';
import Space from '@weco/common/views/components/styled/Space';
import SpacingComponent from '@weco/common/views/components/styled/SpacingComponent';
import { components } from '@weco/common/views/slices';
import { PaletteColor } from '@weco/common/views/themes/config';
import { transformContentListSlice } from '@weco/content/services/prismic/transformers/body';
import { isContentList } from '@weco/content/types/body';
import { convertItemToCardProps } from '@weco/content/types/card';
import { Link } from '@weco/content/types/link';
import Card from '@weco/content/views/components/Card';
import FeaturedCard, {
  convertCardToFeaturedCardProps,
  convertItemToFeaturedCardProps,
} from '@weco/content/views/components/FeaturedCard';
import FeaturedText from '@weco/content/views/components/FeaturedText';
import { Props as ComicPreviousNextProps } from '@weco/content/views/components/ImageGallery/ImageGallery.ComicPreviousNext';
import InPageNavigation from '@weco/content/views/components/InPageNavigation';
import SectionHeader from '@weco/content/views/components/SectionHeader';

import GridFactory, { landingPageGrid } from './GridFactory';

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
  pageUid: string;
  minWidth?: 10 | 8;
  hasLandingPageFormat?: boolean;
  isOfficialLandingPage?: boolean;
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
  firstTextSliceIndex: string;
  isVisualStory: boolean;
  comicPreviousNext?: ComicPreviousNextProps;
  isShortFilm: boolean;
  pageId: string;
  hasLandingPageFormat: boolean;
  isDropCapped: boolean;
  contentType?: 'short-film' | 'visual-story' | 'standalone-image-gallery';
  isInGridCell?: boolean;
  stickyNavA11y?: boolean;
};

export const defaultContext: SliceZoneContext = {
  minWidth: 8,
  firstTextSliceIndex: '',
  isVisualStory: false,
  comicPreviousNext: undefined,
  isShortFilm: false,
  pageId: '',
  hasLandingPageFormat: false,
  isDropCapped: false,
  contentType: undefined,
  isInGridCell: false,
  stickyNavA11y: false,
};

const Body: FunctionComponent<Props> = ({
  untransformedBody,
  introText,
  onThisPage,
  showOnThisPage,
  isDropCapped,
  pageId,
  pageUid,
  minWidth = 8,
  hasLandingPageFormat = false,
  isOfficialLandingPage = false,
  staticContent = null,
  comicPreviousNext,
  contentType,
}: Props) => {
  const { stickyNavA11y } = useToggles();

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
              <DecorativeEdge
                variant="wobbly"
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
                    gridSize={
                      isOfficialLandingPage ? gridSize12() : gridSize8()
                    }
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
                    isOfficialLandingPage ? landingPageGrid : undefined
                  }
                />
              )}
            </Wrapper>
            {!isLast && (
              <DecorativeEdge
                variant="wobbly"
                backgroundColor="white"
                isStatic
              />
            )}
          </Fragment>
        );
      })}
    </>
  );

  const isShortFilm = contentType === 'short-film';
  const isVisualStory = contentType === 'visual-story';

  return (
    <BodyWrapper
      data-component="body"
      className={`content-type-${contentType}`}
      $splitBackground={isShortFilm}
    >
      {!officialLandingPagesUid.includes(pageUid) &&
        introText &&
        introText.length > 0 && (
          <ContaineredLayout gridSizes={gridSize8(!isOfficialLandingPage)}>
            <div className="body-text spaced-text">
              <Space
                $v={{
                  size: isOfficialLandingPage ? 'xl' : 'l',
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

      {onThisPage &&
      onThisPage.length > 2 &&
      showOnThisPage &&
      stickyNavA11y ? (
        <SpacingComponent>
          <ContaineredLayout gridSizes={gridSize12()}>
            <Grid>
              <GridCell
                style={{ background: 'white' }}
                $sizeMap={{ s: [12], m: [12], l: [3], xl: [3] }}
              >
                <InPageNavigation links={onThisPage} variant="sticky" />
              </GridCell>
              <GridCell $sizeMap={{ s: [12], m: [12], l: [9], xl: [9] }}>
                {hasLandingPageFormat && (
                  <LandingPageSections sections={sections} />
                )}

                <SliceZone
                  slices={filteredUntransformedBody}
                  components={components}
                  context={{
                    minWidth,
                    firstTextSliceIndex,
                    isVisualStory,
                    comicPreviousNext,
                    pageId,
                    hasLandingPageFormat,
                    isDropCapped,
                    contentType,
                    isShortFilm,
                    isInGridCell: true,
                    stickyNavA11y,
                  }}
                />
              </GridCell>
            </Grid>
          </ContaineredLayout>
        </SpacingComponent>
      ) : (
        <>
          {onThisPage && onThisPage.length > 2 && showOnThisPage && (
            <SpacingComponent>
              <LayoutWidth width={minWidth}>
                <InPageNavigation links={onThisPage} variant="simple" />
              </LayoutWidth>
            </SpacingComponent>
          )}

          {hasLandingPageFormat && <LandingPageSections sections={sections} />}

          <SliceZone
            slices={filteredUntransformedBody}
            components={components}
            context={{
              minWidth,
              firstTextSliceIndex,
              isVisualStory,
              comicPreviousNext,
              pageId,
              hasLandingPageFormat,
              isDropCapped,
              contentType,
              isShortFilm,
              stickyNavA11y,
            }}
          />
        </>
      )}
    </BodyWrapper>
  );
};

export default Body;
