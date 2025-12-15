import * as prismic from '@prismicio/client';
import { SliceZone } from '@prismicio/react';
import { Fragment, FunctionComponent, ReactElement, useRef } from 'react';
import styled from 'styled-components';

import { officialLandingPagesUid } from '@weco/common/data/hardcoded-ids';
import { useSectionWrappers } from '@weco/common/hooks/useSectionWrappers';
import { ContentListSlice as RawContentListSlice } from '@weco/common/prismicio-types';
import { useToggles } from '@weco/common/server-data/Context';
import { classNames, font } from '@weco/common/utils/classnames';
import ConditionalWrapper from '@weco/common/views/components/ConditionalWrapper';
import DecorativeEdge from '@weco/common/views/components/DecorativeEdge';
import { defaultSerializer } from '@weco/common/views/components/HTMLSerializers';
import {
  ContaineredLayout,
  gridSize12,
  gridSize8,
} from '@weco/common/views/components/Layout';
import { Container } from '@weco/common/views/components/styled/Container';
import {
  Grid,
  GridCell,
  SizeMap,
} from '@weco/common/views/components/styled/Grid';
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

  /* Spacing for wrapper sections created by useSectionWrappers */
  /* This matches the SpacingComponent spacing behaviour */
  section.section-wrapper-spacing + section.section-wrapper-spacing {
    margin-top: ${props => props.theme.getSpaceValue('md', 'zero')};

    ${props =>
      props.theme.media('sm')(`
        margin-top: ${props.theme.getSpaceValue('md', 'sm')};
      `)}

    ${props =>
      props.theme.media('md')(`
        margin-top: ${props.theme.getSpaceValue('md', 'md')};
      `)}
  }
`;

export type Props = {
  untransformedBody: prismic.Slice[];
  introText?: prismic.RichTextField;
  onThisPage?: Link[];
  showOnThisPage?: boolean;
  isDropCapped?: boolean;
  pageId: string;
  pageUid: string;
  gridSizes?: SizeMap;
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
  firstTextSliceIndex: string;
  isVisualStory: boolean;
  isShortFilm: boolean;
  pageId: string;
  hasLandingPageFormat: boolean;
  isDropCapped: boolean;
  gridSizes?: SizeMap;
  comicPreviousNext?: ComicPreviousNextProps;
  contentType?: 'short-film' | 'visual-story' | 'standalone-image-gallery';
};

export const defaultContext: SliceZoneContext = {
  firstTextSliceIndex: '',
  isVisualStory: false,
  isShortFilm: false,
  pageId: '',
  hasLandingPageFormat: false,
  isDropCapped: false,
};

const Body: FunctionComponent<Props> = ({
  untransformedBody,
  introText,
  onThisPage,
  showOnThisPage,
  isDropCapped,
  pageId,
  pageUid,
  gridSizes,
  hasLandingPageFormat = false,
  isOfficialLandingPage = false,
  staticContent = null,
  comicPreviousNext,
  contentType,
}: Props) => {
  const { twoColumns } = useToggles();
  const bodyRef = useRef<HTMLDivElement>(null);

  // Wrap h2 elements and their subsequent content in sections for navigation tracking
  useSectionWrappers(bodyRef, showOnThisPage && !!onThisPage?.length);
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
              <h3 className={font('brand', 2)}>{firstItem.title}</h3>
              {isCardType && firstItem.description && (
                <p className={font('sans', -1)}>{firstItem.description}</p>
              )}
              {'promo' in firstItem && firstItem.promo && (
                <p className={font('sans', -1)}>{firstItem.promo.caption}</p>
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
                <Space $v={{ size: 'md', properties: ['margin-bottom'] }}>
                  <SectionHeader
                    title={section.value.title}
                    gridSize={
                      isOfficialLandingPage ? gridSize12() : gridSize8()
                    }
                  />
                </Space>
              )}
              {featuredItem && (
                <Space $v={{ size: 'md', properties: ['margin-bottom'] }}>
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

  const displayOnThisPage =
    showOnThisPage && onThisPage && onThisPage.length > 2;
  const isTwoColumns = !!(twoColumns && displayOnThisPage);

  return (
    <ConditionalWrapper
      condition={isTwoColumns}
      wrapper={children => (
        <Container>
          <Grid style={{ background: 'white', rowGap: 0 }}>
            <InPageNavigation
              variant="sticky"
              links={onThisPage!}
              sizeMap={{ s: [12], m: [12], l: [3], xl: [3] }}
              isOnWhite
            />

            <GridCell $sizeMap={{ s: [12], m: [12], l: [9], xl: [9] }}>
              <Space $v={{ size: 'sm', properties: ['padding-top'] }}>
                {children}
              </Space>
            </GridCell>
          </Grid>
        </Container>
      )}
    >
      <BodyWrapper
        ref={bodyRef}
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
                    size: isOfficialLandingPage ? 'xl' : 'md',
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

        {!isTwoColumns && displayOnThisPage && (
          <SpacingComponent>
            <ConditionalWrapper
              condition={!!gridSizes}
              wrapper={children => (
                <ContaineredLayout gridSizes={gridSizes!}>
                  {children}
                </ContaineredLayout>
              )}
            >
              <InPageNavigation links={onThisPage} variant="simple" />
            </ConditionalWrapper>
          </SpacingComponent>
        )}

        {hasLandingPageFormat && <LandingPageSections sections={sections} />}

        <SliceZone
          slices={filteredUntransformedBody}
          components={components}
          context={{
            gridSizes: isTwoColumns ? undefined : gridSizes,
            firstTextSliceIndex,
            isVisualStory,
            comicPreviousNext,
            pageId,
            hasLandingPageFormat,
            isDropCapped,
            contentType,
            isShortFilm,
          }}
        />
      </BodyWrapper>
    </ConditionalWrapper>
  );
};

export default Body;
