import dynamic from 'next/dynamic';
import { ReactNode, ReactElement, FunctionComponent } from 'react';
import { classNames } from '../../../utils/classnames';
import AsyncSearchResults from '../SearchResults/AsyncSearchResults';
import SearchResults from '../SearchResults/SearchResults';
import { CaptionedImage } from '../Images/Images';
import SpacingComponent from '../SpacingComponent/SpacingComponent';
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

import TagsGroup from '../TagsGroup/TagsGroup';
import Discussion from '../Discussion/Discussion';
import WobblyEdgedContainer from '../WobblyEdgedContainer/WobblyEdgedContainer';

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
};

const Body: FunctionComponent<Props> = ({
  body,
  onThisPage,
  showOnThisPage,
  isDropCapped,
  pageId,
  minWidth = 8,
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

  return (
    <div
      className={classNames({
        'basic-body': true,
      })}
    >
      {onThisPage && onThisPage.length > 2 && showOnThisPage && (
        <SpacingComponent>
          <LayoutWidth width={minWidth}>
            <OnThisPageAnchors links={onThisPage} />
          </LayoutWidth>
        </SpacingComponent>
      )}
      {filteredBody.map((slice, i) => (
        <SpacingComponent key={`slice${i}`}>
          <div
            className={classNames({
              'body-part': true,
            })}
          >
            {slice.type === 'inPageAnchor' && <span id={slice.value} />}
            {slice.type === 'text' && (
              <LayoutWidth width={minWidth}>
                <div className="body-text spaced-text">
                  {slice.weight === 'featured' && (
                    <FeaturedText
                      html={slice.value}
                      htmlSerializer={defaultSerializer}
                    />
                  )}
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
            {slice.type === 'contentList' && (
              <LayoutWidth width={minWidth}>
                {/* FIXME: this makes what-we-do and visit-us contentLists synchronous,
                but it's hacky. */}
                {pageId === prismicPageIds.whatWeDo ||
                pageId === prismicPageIds.visitUs ? (
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
                <TagsGroup title={slice.value.title} tags={slice.value.tags} />
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
      ))}
    </div>
  );
};

export default Body;
