import dynamic from 'next/dynamic';
import React, {
  ReactNode,
  ReactElement,
  FunctionComponent,
  Fragment,
} from 'react';
import styled from 'styled-components';
import { font } from '@weco/common/utils/classnames';
import { Link } from '../../types/link';
import {
  defaultSerializer,
  dropCapSerializer,
} from '../HTMLSerializers/HTMLSerializers';
import { prismicPageIds } from '@weco/common/data/hardcoded-ids';
import CaptionedImage from '../CaptionedImage/CaptionedImage';
import SpacingComponent from '@weco/common/views/components/SpacingComponent/SpacingComponent';
import SectionHeader from '@weco/common/views/components/SectionHeader/SectionHeader';
import Space from '@weco/common/views/components/styled/Space';
import Quote from '../Quote/Quote';
import PrismicHtmlBlock from '@weco/common/views/components/PrismicHtmlBlock/PrismicHtmlBlock';
import FeaturedText from '../FeaturedText/FeaturedText';
import VideoEmbed from '@weco/common/views/components/VideoEmbed/VideoEmbed';
import GifVideo from '../GifVideo/GifVideo';
import AudioPlayer from '@weco/common/views/components/AudioPlayer/AudioPlayer';
import Contact from '@weco/common/views/components/Contact/Contact';
import Iframe from '@weco/common/views/components/Iframe/Iframe';
import DeprecatedImageList from '../DeprecatedImageList/DeprecatedImageList';
import Layout from '@weco/common/views/components/Layout/Layout';
import Layout8 from '@weco/common/views/components/Layout8/Layout8';
import Layout10 from '@weco/common/views/components/Layout10/Layout10';
import Layout12 from '@weco/common/views/components/Layout12/Layout12';
import OnThisPageAnchors from '../OnThisPageAnchors/OnThisPageAnchors';
import VenueClosedPeriods from '../VenueClosedPeriods/VenueClosedPeriods';
import Table from '@weco/common/views/components/Table/Table';
import MediaObjectList from '../MediaObjectList/MediaObjectList';
import InfoBlock from '@weco/common/views/components/InfoBlock/InfoBlock';
import TitledTextList from '../TitledTextList/TitledTextList';
import TagsGroup from '@weco/common/views/components/TagsGroup/TagsGroup';
import Discussion from '../Discussion/Discussion';
import WobblyEdgedContainer from '@weco/common/views/components/WobblyEdgedContainer/WobblyEdgedContainer';
import WobblyEdge from '@weco/common/views/components/WobblyEdge/WobblyEdge';
import GridFactory, { sectionLevelPageGrid } from './GridFactory';
import Card from '../Card/Card';
import { convertItemToCardProps } from '../../types/card';
import { BodySlice, isContentList } from '../../types/body';
import AsyncSearchResults from '../SearchResults/AsyncSearchResults';
import SearchResults from '../SearchResults/SearchResults';
import VenueHours from '../VenueHours/VenueHours';
import FeaturedCard, {
  convertItemToFeaturedCardProps,
  convertCardToFeaturedCardProps,
} from '../FeaturedCard/FeaturedCard';
import ImageGallery from '../ImageGallery/ImageGallery';
import { isNotUndefined } from '@weco/common/utils/array';
import SoundCloudEmbed from '../SoundCloudEmbed/SoundCloudEmbed';
import * as prismicT from '@prismicio/types';

const Map = dynamic(import('../Map/Map'), {
  ssr: false,
});

type LayoutWidthProps = {
  width: 8 | 10;
  children: ReactNode;
};

const LayoutWidth: FunctionComponent<LayoutWidthProps> = ({
  width,
  children,
}: LayoutWidthProps): ReactElement | null => {
  switch (true) {
    case width === 10:
      return <Layout10>{children}</Layout10>;
    case width === 8:
      return <Layout8>{children}</Layout8>;
    default:
      return null;
  }
};

type Props = {
  body: BodySlice[];
  onThisPage?: Link[];
  showOnThisPage?: boolean;
  isDropCapped?: boolean;
  pageId: string;
  minWidth?: 10 | 8;
  isLanding?: boolean;
  sectionLevelPage?: boolean;
  staticContent?: ReactElement | null;
};

type ContentListSlice = BodySlice & { type: 'contentList' };

const Wrapper = styled(Space).attrs<{
  rowBackgroundColor: string;
  cardBackgroundColor: string;
}>(props => ({
  className: `row card-theme
  bg-${props.rowBackgroundColor}
    card-theme--${props.cardBackgroundColor}`, // Keeping bg-[color] class as some components below are styled based on this parent class.
}))<{ rowBackgroundColor: string; cardBackgroundColor: string }>`
  background-color: ${props => props.theme.color(props.rowBackgroundColor)};
`;

const Body: FunctionComponent<Props> = ({
  body,
  onThisPage,
  showOnThisPage,
  isDropCapped,
  pageId,
  minWidth = 8,
  isLanding = false,
  sectionLevelPage = false,
  staticContent = null,
}: Props) => {
  const filteredBody = body
    .filter(slice => !(slice.type === 'picture' && slice.weight === 'featured'))
    // The standfirst is now put into the header
    // and used exclusively by articles / article series
    .filter(slice => slice.type !== 'standfirst');

  const firstTextSliceIndex = filteredBody
    .map(slice => slice.type)
    .indexOf('text');
  let imageGalleryIdCount = 1;

  const sections: ContentListSlice[] = body.filter(isContentList);
  const sectionThemes = [
    {
      rowBackground: 'white',
      cardBackground: 'cream',
      featuredCardBackground: 'charcoal',
      featuredCardText: 'white',
    },
    {
      rowBackground: 'cream',
      cardBackground: 'white',
      featuredCardBackground: 'white',
      featuredCardText: 'black',
    },
    {
      rowBackground: 'white',
      cardBackground: 'cream',
      featuredCardBackground: 'cream',
      featuredCardText: 'black',
    },
    {
      rowBackground: 'charcoal',
      cardBackground: 'transparent',
      featuredCardBackground: 'white',
      featuredCardText: 'black',
    },
  ];
  const AdditionalContent = ({
    index,
    sections = [],
    isLanding = false,
    staticContent,
  }: {
    index: number;
    sections: ContentListSlice[];
    isLanding: boolean;
    staticContent: ReactElement | null;
  }): ReactElement<Props> | null => {
    if (index === 0) {
      return (
        <>
          {staticContent}
          {onThisPage && onThisPage.length > 2 && showOnThisPage && (
            <SpacingComponent>
              <LayoutWidth width={minWidth}>
                <OnThisPageAnchors links={onThisPage} />
              </LayoutWidth>
            </SpacingComponent>
          )}
          {isLanding &&
            sections.map((section, index) => {
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
                    color={sectionTheme.featuredCardText}
                    isReversed={false}
                  >
                    <h2 className={font('wb', 2)}>{firstItem.title}</h2>
                    {isCardType && firstItem.description && (
                      <p className={font('intr', 5)}>{firstItem.description}</p>
                    )}
                    {'promo' in firstItem && firstItem.promo && (
                      <p className={font('intr', 5)}>
                        {firstItem.promo.caption}
                      </p>
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
                      background={sectionTheme.rowBackground}
                      isStatic
                    />
                  )}
                  <Wrapper
                    v={{
                      size: 'xl',
                      properties:
                        isLast && sectionTheme.rowBackground === 'white'
                          ? ['padding-top']
                          : isFirst && sectionTheme.rowBackground === 'white'
                          ? ['padding-bottom']
                          : ['padding-top', 'padding-bottom'],
                    }}
                    rowBackgroundColor={sectionTheme.rowBackground}
                    cardBackgroundColor={sectionTheme.cardBackground}
                  >
                    {section.value.title && (
                      <Space v={{ size: 'l', properties: ['margin-bottom'] }}>
                        <SectionHeader title={section.value.title} />
                      </Space>
                    )}
                    {featuredItem && (
                      <Space v={{ size: 'l', properties: ['margin-bottom'] }}>
                        <Layout12>{featuredItem}</Layout12>
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
                  {!isLast && <WobblyEdge background="white" isStatic />}
                </Fragment>
              );
            })}
        </>
      );
    } else {
      return null;
    }
  };

  return (
    <div className="basic-body">
      {filteredBody.length < 1 && (
        <AdditionalContent
          index={0}
          sections={sections}
          isLanding={isLanding}
          staticContent={staticContent}
        />
      )}

      {filteredBody.map((slice, i) => (
        <Fragment key={i}>
          {/* If the first slice is featured text we display it any static content, i.e. <AdditionalContent /> */}
          {i === 0 && slice.type === 'text' && slice.weight === 'featured' && (
            <Layout8 shift={!sectionLevelPage}>
              <div className="body-text spaced-text">
                <Space
                  v={{
                    size: sectionLevelPage ? 'xl' : 'l',
                    properties: ['margin-bottom'],
                  }}
                >
                  <FeaturedText
                    html={slice.value}
                    htmlSerializer={defaultSerializer}
                  />
                </Space>
              </div>
            </Layout8>
          )}
          <AdditionalContent
            index={i}
            sections={sections}
            isLanding={isLanding}
            staticContent={staticContent}
          />
          {!(
            i === 0 &&
            slice.type === 'text' &&
            slice.weight === 'featured'
          ) && (
            <>
              {slice.type === 'text' && (
                <SpacingComponent>
                  <LayoutWidth width={minWidth}>
                    <div className="body-text spaced-text">
                      {slice.weight !== 'featured' &&
                        (firstTextSliceIndex === i && isDropCapped ? (
                          <>
                            {/*
                                The featured text slice can contain multiple paragraphs,
                                e.g. https://wellcomecollection.org/articles/XcMBBREAACUAtBoV

                                The drop cap serializer will see them as two separate paragraphs,
                                so we have to split out the first paragraph here.
                              */}
                            <PrismicHtmlBlock
                              html={[slice.value[0]] as prismicT.RichTextField}
                              htmlSerializer={dropCapSerializer}
                            />
                            <PrismicHtmlBlock
                              html={
                                slice.value.slice(1) as prismicT.RichTextField
                              }
                              htmlSerializer={defaultSerializer}
                            />
                          </>
                        ) : (
                          <PrismicHtmlBlock
                            html={slice.value}
                            htmlSerializer={defaultSerializer}
                          />
                        ))}
                    </div>
                  </LayoutWidth>
                </SpacingComponent>
              )}

              {/* TODO: use one layout for all image weights if/when it's established
              that width isn't an adequate means to illustrate a difference */}
              {slice.type === 'picture' && slice.weight === 'default' && (
                <SpacingComponent>
                  <Layout10>
                    <CaptionedImage {...slice.value} />
                  </Layout10>
                </SpacingComponent>
              )}
              {slice.type === 'picture' && slice.weight === 'standalone' && (
                <SpacingComponent>
                  <Layout12>
                    <CaptionedImage {...slice.value} />
                  </Layout12>
                </SpacingComponent>
              )}
              {slice.type === 'picture' && slice.weight === 'supporting' && (
                <SpacingComponent>
                  <LayoutWidth width={minWidth}>
                    <CaptionedImage {...slice.value} />
                  </LayoutWidth>
                </SpacingComponent>
              )}
              {slice.type === 'imageGallery' && (
                <SpacingComponent>
                  <ImageGallery {...slice.value} id={imageGalleryIdCount++} />
                </SpacingComponent>
              )}
              {slice.type === 'quote' && (
                <SpacingComponent>
                  <LayoutWidth width={minWidth}>
                    <Quote {...slice.value} />
                  </LayoutWidth>
                </SpacingComponent>
              )}
              {slice.type === 'titledTextList' && (
                <SpacingComponent>
                  <LayoutWidth width={minWidth}>
                    <TitledTextList {...slice.value} />
                  </LayoutWidth>
                </SpacingComponent>
              )}
              {slice.type === 'contentList' && !isLanding && (
                <SpacingComponent>
                  <LayoutWidth width={minWidth}>
                    {/* FIXME: this makes what-we-do contentLists synchronous, but it's hacky. */}
                    {pageId === prismicPageIds.whatWeDo ? (
                      <SearchResults
                        title={slice.value.title}
                        items={slice.value.items}
                      />
                    ) : (
                      <AsyncSearchResults
                        title={slice.value.title}
                        query={slice.value.items
                          .map(item =>
                            'id' in item ? `id:${item.id}` : undefined
                          )
                          .filter(isNotUndefined)
                          .join(' ')}
                      />
                    )}
                  </LayoutWidth>
                </SpacingComponent>
              )}
              {/* TODO: remove this slice type if we're not using it? */}
              {slice.type === 'searchResults' && (
                <SpacingComponent>
                  <LayoutWidth width={minWidth}>
                    <AsyncSearchResults {...slice.value} />
                  </LayoutWidth>
                </SpacingComponent>
              )}
              {slice.type === 'videoEmbed' && (
                <SpacingComponent>
                  <LayoutWidth width={minWidth}>
                    <VideoEmbed {...slice.value} />
                  </LayoutWidth>
                </SpacingComponent>
              )}
              {slice.type === 'soundcloudEmbed' && (
                <SpacingComponent>
                  <LayoutWidth width={minWidth}>
                    <SoundCloudEmbed {...slice.value} />
                  </LayoutWidth>
                </SpacingComponent>
              )}
              {slice.type === 'map' && (
                <SpacingComponent>
                  <LayoutWidth width={minWidth}>
                    <Map {...slice.value} />
                  </LayoutWidth>
                </SpacingComponent>
              )}
              {slice.type === 'gifVideo' && (
                <SpacingComponent>
                  <Layout10>
                    <GifVideo {...slice.value} />
                  </Layout10>
                </SpacingComponent>
              )}
              {slice.type === 'iframe' && (
                <SpacingComponent>
                  <Layout10>
                    <Iframe {...slice.value} />
                  </Layout10>
                </SpacingComponent>
              )}
              {slice.type === 'contact' && (
                <SpacingComponent>
                  <LayoutWidth width={minWidth}>
                    <Contact {...slice.value} />
                  </LayoutWidth>
                </SpacingComponent>
              )}
              {slice.type === 'collectionVenue' && (
                <SpacingComponent>
                  {slice.value.showClosingTimes && (
                    <LayoutWidth width={minWidth}>
                      <VenueClosedPeriods venue={slice.value.content} />
                    </LayoutWidth>
                  )}
                  {!slice.value.showClosingTimes && (
                    <Layout
                      gridSizes={
                        slice.weight === 'featured'
                          ? {
                              s: 12,
                              m: 12,
                              l: 11,
                              shiftL: 1,
                              xl: 10,
                              shiftXL: 2,
                            }
                          : {
                              s: 12,
                              m: 10,
                              shiftM: 1,
                              l: 8,
                              shiftL: 2,
                              xl: 8,
                              shiftXL: 2,
                            }
                      }
                    >
                      <VenueHours
                        venue={slice.value.content}
                        weight={slice.weight || 'default'}
                      />
                    </Layout>
                  )}
                </SpacingComponent>
              )}
              {slice.type === 'table' && (
                <SpacingComponent>
                  <LayoutWidth width={minWidth}>
                    <Table {...slice.value} />
                  </LayoutWidth>
                </SpacingComponent>
              )}
              {slice.type === 'infoBlock' && (
                <SpacingComponent>
                  <LayoutWidth width={minWidth}>
                    <InfoBlock {...slice.value} />
                  </LayoutWidth>
                </SpacingComponent>
              )}
              {slice.type === 'discussion' && (
                <SpacingComponent>
                  <WobblyEdgedContainer>
                    <Discussion
                      title={slice.value.title}
                      text={slice.value.text}
                    />
                  </WobblyEdgedContainer>
                </SpacingComponent>
              )}
              {slice.type === 'tagList' && (
                <SpacingComponent>
                  <LayoutWidth width={minWidth}>
                    <TagsGroup {...slice.value} />
                  </LayoutWidth>
                </SpacingComponent>
              )}
              {/* deprecated */}
              {slice.type === 'deprecatedImageList' && (
                <SpacingComponent>
                  <LayoutWidth width={minWidth}>
                    <DeprecatedImageList {...slice.value} />
                  </LayoutWidth>
                </SpacingComponent>
              )}
              {slice.type === 'mediaObjectList' && (
                <SpacingComponent>
                  <LayoutWidth width={minWidth}>
                    <MediaObjectList {...slice.value} />
                  </LayoutWidth>
                </SpacingComponent>
              )}
              {slice.type === 'audioPlayer' && (
                <SpacingComponent>
                  <LayoutWidth width={minWidth}>
                    <AudioPlayer {...slice.value} />
                  </LayoutWidth>
                </SpacingComponent>
              )}
            </>
          )}
        </Fragment>
      ))}
    </div>
  );
};

export default Body;
