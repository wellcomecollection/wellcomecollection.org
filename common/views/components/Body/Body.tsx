import dynamic from 'next/dynamic';
import { ReactNode, ReactElement, FunctionComponent } from 'react';
import { classNames } from '../../../utils/classnames';
import AsyncSearchResults from '../SearchResults/AsyncSearchResults';
import SearchResults from '../SearchResults/SearchResults';
import { CaptionedImage } from '../Images/Images';
import SpacingComponent from '../SpacingComponent/SpacingComponent';
import SpacingSection from '../SpacingSection/SpacingSection';
import SectionHeader from '../SectionHeader/SectionHeader';
import Space from '../styled/Space';
import Quote from '../Quote/Quote';
import ImageGallery from '../ImageGallery/ImageGallery';
import PrismicHtmlBlock from '../PrismicHtmlBlock/PrismicHtmlBlock';
import FeaturedText from '../FeaturedText/FeaturedText';
import VideoEmbed from '../VideoEmbed/VideoEmbed';
import GifVideo from '../GifVideo/GifVideo';
import Contact from '../Contact/Contact';
import Iframe from '../Iframe/Iframe';
import DeprecatedImageList from '../DeprecatedImageList/DeprecatedImageList';
import Layout from '../Layout/Layout';
import Layout8 from '../Layout8/Layout8';
import Layout6 from '../Layout6/Layout6';
import Layout10 from '../Layout10/Layout10';
import Layout12 from '../Layout12/Layout12';
import VenueHours from '../VenueHours/VenueHours';
import { Link } from '../../../model/link';
import OnThisPageAnchors from '../OnThisPageAnchors/OnThisPageAnchors';
import VenueClosedPeriods from '../VenueClosedPeriods/VenueClosedPeriods';
import Table from '../Table/Table';
import {
  defaultSerializer,
  dropCapSerializer,
} from '../../../services/prismic/html-serializers';
import { Weight } from '../../../services/prismic/parsers';
import MediaObjectList from '../MediaObjectList/MediaObjectList';
import InfoBlock from '../InfoBlock/InfoBlock';
import { prismicPageIds } from '../../../services/prismic/hardcoded-id';

import TitledTextList from '../TitledTextList/TitledTextList';
import TagsGroup from '../TagsGroup/TagsGroup';
import Discussion from '../Discussion/Discussion';
import WobblyEdgedContainer from '../WobblyEdgedContainer/WobblyEdgedContainer';
import WobblyEdge from '../WobblyEdge/WobblyEdge';

import GridFactory, { sectionLevelPageGrid } from '../GridFactory/GridFactory';
import Card from '../Card/Card';
import FeaturedCard, {
  convertItemToFeaturedCardProps,
  convertCardToFeaturedCardProps,
} from '../FeaturedCard/FeaturedCard';
import { convertItemToCardProps } from '@weco/common/model/card';
import ConditionalWrapper from '../ConditionalWrapper/ConditionalWrapper';
import VisitUsStaticContent from './VisitUsStaticContent';
import CollectionsStaticContent from './CollectionsStaticContent';

const Map = dynamic(import('../Map/Map'), { ssr: false });

type BodySlice = {
  type: string;
  weight?: Weight;
  // TODO: Sync up types with the body slices and the components they return
  value: any;
};

export type BodyType = BodySlice[];

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
  body: BodyType;
  onThisPage?: Link[];
  showOnThisPage?: boolean;
  isDropCapped?: boolean;
  pageId: string;
  minWidth?: 10 | 8;
  isLanding?: boolean;
  sectionLevelPage?: boolean;
};

const Body: FunctionComponent<Props> = ({
  body,
  onThisPage,
  showOnThisPage,
  isDropCapped,
  pageId,
  minWidth = 8,
  isLanding = false,
  sectionLevelPage = false,
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

  const sections = body.filter(slice => slice.type === 'contentList');
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
  }: {
    index: number;
    sections: BodyType;
    isLanding: boolean;
  }): ReactElement<Props> | null => {
    if (index === 0) {
      return (
        <>
          {pageId === prismicPageIds.visitUs && <VisitUsStaticContent />}
          {pageId === prismicPageIds.collections && (
            <CollectionsStaticContent />
          )}
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
              const hasFeatured =
                Boolean(section.value.hasFeatured) ||
                section.value.items.length === 1;
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
                    <h2 className="font-wb font-size-2">{firstItem.title}</h2>
                    {isCardType && firstItem.description && (
                      <p className="font-hnl font-size-5">
                        {firstItem.description}
                      </p>
                    )}
                    {firstItem.promo && (
                      <p className="font-hnl font-size-5">
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
                <ConditionalWrapper
                  key={index}
                  condition={!isLast}
                  wrapper={children => (
                    <SpacingSection>{children}</SpacingSection>
                  )}
                >
                  {!isFirst && (
                    <WobblyEdge
                      background={sectionTheme.rowBackground}
                      isStatic
                    />
                  )}
                  <Space
                    v={{
                      size: 'xl',
                      properties: isLast
                        ? ['padding-top']
                        : ['padding-top', 'padding-bottom'],
                    }}
                    className={classNames({
                      'row card-theme': true,
                      [`bg-${sectionTheme.rowBackground}`]: true,
                      [`card-theme--${sectionTheme.cardBackground}`]: true,
                    })}
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
                          sectionLevelPage && sectionLevelPageGrid
                        }
                      />
                    )}
                  </Space>

                  {!isLast && <WobblyEdge background={'white'} isStatic />}
                </ConditionalWrapper>
              );
            })}
        </>
      );
    } else {
      return null;
    }
  };

  return (
    <div
      className={classNames({
        'basic-body': true,
      })}
    >
      {filteredBody.length < 1 && (
        <AdditionalContent
          index={0}
          sections={sections}
          isLanding={isLanding}
        />
      )}

      {filteredBody.map((slice, i) => (
        <>
          {slice.type === 'inPageAnchor' && <span id={slice.value} />}
          {/* If the first slice is featured text we display it above inPageAnchors and any static content, i.e. <AdditionalContent /> */}
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
          />
          {!(
            i === 0 &&
            slice.type === 'text' &&
            slice.weight === 'featured'
          ) && (
            <SpacingComponent>
              <div
                className={classNames({
                  'body-part': true,
                })}
              >
                {slice.type === 'text' && (
                  <LayoutWidth width={minWidth}>
                    <div className="body-text spaced-text">
                      {slice.weight !== 'featured' &&
                        (firstTextSliceIndex === i && isDropCapped ? (
                          <PrismicHtmlBlock
                            html={slice.value}
                            htmlSerializer={dropCapSerializer}
                          />
                        ) : (
                          <PrismicHtmlBlock
                            html={slice.value}
                            htmlSerializer={defaultSerializer}
                          />
                        ))}
                    </div>
                  </LayoutWidth>
                )}

                {/* TODO: use one layout for all image weights if/when it's established
              that width isn't an adequate means to illustrate a difference */}
                {slice.type === 'picture' && slice.weight === 'body' && (
                  <Layout6>
                    <CaptionedImage
                      {...slice.value}
                      sizesQueries={''}
                      extraClasses={'captioned-image--body'}
                    />
                  </Layout6>
                )}
                {slice.type === 'picture' && slice.weight === 'default' && (
                  <Layout10>
                    <CaptionedImage {...slice.value} sizesQueries={''} />
                  </Layout10>
                )}
                {slice.type === 'picture' && slice.weight === 'standalone' && (
                  <Layout12>
                    <CaptionedImage {...slice.value} sizesQueries={''} />
                  </Layout12>
                )}
                {slice.type === 'picture' && slice.weight === 'supporting' && (
                  <LayoutWidth width={minWidth}>
                    <CaptionedImage {...slice.value} sizesQueries={''} />
                  </LayoutWidth>
                )}
                {slice.type === 'imageGallery' && (
                  <ImageGallery
                    isStandalone={slice.weight === 'standalone'}
                    {...slice.value}
                    id={imageGalleryIdCount++}
                  />
                )}
                {slice.type === 'quote' && (
                  <LayoutWidth width={minWidth}>
                    <Quote {...slice.value} />
                  </LayoutWidth>
                )}
                {slice.type === 'titledTextList' && (
                  <LayoutWidth width={minWidth}>
                    <TitledTextList {...slice.value} />
                  </LayoutWidth>
                )}
                {slice.type === 'contentList' && !isLanding && (
                  <LayoutWidth width={minWidth}>
                    {/* FIXME: this makes what-we-do contentLists synchronous,
                but it's hacky. */}
                    {pageId === prismicPageIds.whatWeDo ? (
                      <SearchResults
                        title={slice.value.title}
                        items={slice.value.items}
                      />
                    ) : (
                      <AsyncSearchResults
                        title={slice.value.title}
                        query={slice.value.items
                          .map(({ id }) => `id:${id}`)
                          .join(' ')}
                      />
                    )}
                  </LayoutWidth>
                )}
                {/* TODO: remove this slice type if we're not using it? */}
                {slice.type === 'searchResults' && (
                  <LayoutWidth width={minWidth}>
                    <AsyncSearchResults {...slice.value} />
                  </LayoutWidth>
                )}
                {slice.type === 'videoEmbed' && (
                  <LayoutWidth width={minWidth}>
                    <VideoEmbed {...slice.value} />
                  </LayoutWidth>
                )}
                {slice.type === 'soundcloudEmbed' && (
                  <LayoutWidth width={minWidth}>
                    <iframe
                      width="100%"
                      height="140"
                      frameBorder="no"
                      title="soundcloud player"
                      src={slice.value.embedUrl}
                    />
                  </LayoutWidth>
                )}
                {slice.type === 'map' && (
                  <LayoutWidth width={minWidth}>
                    <Map {...slice.value} />
                  </LayoutWidth>
                )}
                {slice.type === 'gifVideo' && (
                  <Layout10>
                    <GifVideo {...slice.value} />
                  </Layout10>
                )}
                {slice.type === 'iframe' && (
                  <Layout10>
                    <Iframe {...slice.value} />
                  </Layout10>
                )}
                {slice.type === 'contact' && (
                  <LayoutWidth width={minWidth}>
                    <Contact {...slice.value} />
                  </LayoutWidth>
                )}
                {slice.type === 'collectionVenue' && (
                  <>
                    {slice.value.showClosingTimes && (
                      <LayoutWidth width={minWidth}>
                        <VenueClosedPeriods venue={slice.value.content} />
                      </LayoutWidth>
                    )}
                    {!slice.value.showClosingTimes && (
                      <>
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
                      </>
                    )}
                  </>
                )}
                {slice.type === 'table' && (
                  <LayoutWidth width={minWidth}>
                    <Table {...slice.value} />
                  </LayoutWidth>
                )}
                {slice.type === 'infoBlock' && (
                  <LayoutWidth width={minWidth}>
                    <InfoBlock {...slice.value} />
                  </LayoutWidth>
                )}
                {slice.type === 'discussion' && (
                  <WobblyEdgedContainer>
                    <Discussion
                      title={slice.value.title}
                      discussion={slice.value.discussion}
                    />
                  </WobblyEdgedContainer>
                )}
                {slice.type === 'tagList' && (
                  <LayoutWidth width={minWidth}>
                    <TagsGroup
                      title={slice.value.title}
                      tags={slice.value.tags}
                    />
                  </LayoutWidth>
                )}
                {/* deprecated */}
                {slice.type === 'deprecatedImageList' && (
                  <LayoutWidth width={minWidth}>
                    <DeprecatedImageList {...slice.value} />
                  </LayoutWidth>
                )}
                {slice.type === 'mediaObjectList' && (
                  <LayoutWidth width={minWidth}>
                    <MediaObjectList {...slice.value} />
                  </LayoutWidth>
                )}
              </div>
            </SpacingComponent>
          )}
        </>
      ))}
    </div>
  );
};

export default Body;
