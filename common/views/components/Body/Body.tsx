import dynamic from 'next/dynamic';
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
import { FunctionComponent } from 'react';
import TagsGroup from '../TagsGroup/TagsGroup';

const Map = dynamic(import('../Map/Map'), { ssr: false });

type BodySlice = {
  type: string;
  weight?: Weight;
  // TODO: Sync up types with the body slices and the components they return
  value: any;
};

export type BodyType = BodySlice[];

type Props = {
  body: BodyType;
  onThisPage?: Link[];
  showOnThisPage?: boolean;
  isDropCapped?: boolean;
  pageId: string;
};

const Body: FunctionComponent<Props> = ({
  body,
  onThisPage,
  showOnThisPage,
  isDropCapped,
  pageId,
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
          <Layout8>
            <OnThisPageAnchors links={onThisPage} />
          </Layout8>
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
              <Layout8>
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
              </Layout8>
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
              <Layout8>
                <CaptionedImage {...slice.value} sizesQueries={''} />
              </Layout8>
            )}
            {slice.type === 'imageGallery' && (
              <ImageGallery
                isStandalone={slice.weight === 'standalone'}
                {...slice.value}
                id={imageGalleryIdCount++}
              />
            )}
            {slice.type === 'quote' && (
              <Layout8>
                <Quote {...slice.value} />
              </Layout8>
            )}
            {slice.type === 'contentList' && (
              <Layout8>
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
              </Layout8>
            )}
            {/* TODO: remove this slice type if we're not using it? */}
            {slice.type === 'searchResults' && (
              <Layout8>
                <AsyncSearchResults {...slice.value} />
              </Layout8>
            )}
            {slice.type === 'videoEmbed' && (
              <Layout8>
                <VideoEmbed {...slice.value} />
              </Layout8>
            )}
            {slice.type === 'soundcloudEmbed' && (
              <Layout8>
                <iframe
                  width="100%"
                  height="20"
                  frameBorder="none"
                  src={slice.value.embedUrl}
                />
              </Layout8>
            )}
            {slice.type === 'map' && (
              <Layout8>
                <Map {...slice.value} />
              </Layout8>
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
              <Layout8>
                <Contact {...slice.value} />
              </Layout8>
            )}
            {slice.type === 'collectionVenue' && (
              <>
                {slice.value.showClosingTimes && (
                  <Layout8>
                    <VenueClosedPeriods venue={slice.value.content} />
                  </Layout8>
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
              <Layout8>
                <Table {...slice.value} />
              </Layout8>
            )}
            {slice.type === 'infoBlock' && (
              <Layout8>
                <InfoBlock {...slice.value} />
              </Layout8>
            )}
            {slice.type === 'tagList' && (
              <Layout8>
                <TagsGroup title={slice.value.title} tags={slice.value.tags} />
              </Layout8>
            )}
            {/* deprecated */}
            {slice.type === 'deprecatedImageList' && (
              <Layout8>
                <DeprecatedImageList {...slice.value} />
              </Layout8>
            )}
            {slice.type === 'mediaObjectList' && (
              <Layout8>
                <MediaObjectList {...slice.value} />
              </Layout8>
            )}
          </div>
        </SpacingComponent>
      ))}
    </div>
  );
};

export default Body;
