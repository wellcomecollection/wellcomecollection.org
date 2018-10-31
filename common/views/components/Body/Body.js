// @flow
// TODO: Sync up types with the body slices and the components they return
import {classNames} from '../../../utils/classnames';
import AsyncSearchResults from '../SearchResults/AsyncSearchResults';
import {CaptionedImage} from '../Images/Images';
import SpacingComponent from '../SpacingComponent/SpacingComponent';
import Quote from '../Quote/Quote';
import ImageGalleryV2 from '../ImageGalleryV2/ImageGalleryV2';
import PrismicHtmlBlock from '../PrismicHtmlBlock/PrismicHtmlBlock';
import FeaturedText from '../FeaturedText/FeaturedText';
import VideoEmbed from '../VideoEmbed/VideoEmbed';
import GifVideo from '../GifVideo/GifVideo';
import Iframe from '../Iframe/Iframe';
import Map from '../Map/Map';
import DeprecatedImageList from '../DeprecatedImageList/DeprecatedImageList';
import Layout8 from '../Layout8/Layout8';
import Layout10 from '../Layout10/Layout10';
import Layout12 from '../Layout12/Layout12';
import {dropCapSerialiser} from '../../../services/prismic/html-serialisers';
import type {Weight} from '../../../services/prismic/parsers';

type BodySlice = {|
  type: string,
  weight: Weight,
  value: any
|}

export type BodyType = BodySlice[]

type Props = {|
  body: BodyType,
  isDropCapped?: boolean
|}

const Body = ({
  body,
  isDropCapped
}: Props) => {
  const filteredBody = body
    .filter(slice => !(slice.type === 'picture' && slice.weight === 'featured'))
    // The standfirst is now put into the header
    // and used exclusively by articles / article series
    .filter(slice => slice.type !== 'standfirst');

  const firstTextSliceIndex = filteredBody.map(slice => slice.type).indexOf('text');
  let imageGalleryIdCount = 1;

  return (
    <div className={classNames({
      'basic-body': true
    })}>
      {filteredBody
        .map((slice, i) => (
          <SpacingComponent key={`slice${i}`}>
            <div className={classNames({
              'body-part': true,
              'overflow-hidden': true
            })}>
              {slice.type === 'text' &&
                <Layout8>
                  <div className='body-text spaced-text'>
                    {slice.weight === 'featured' && <FeaturedText html={slice.value} />}
                    {slice.weight !== 'featured' &&
                      (firstTextSliceIndex === i && isDropCapped
                        ? <PrismicHtmlBlock html={slice.value} htmlSerialiser={dropCapSerialiser} />
                        : <PrismicHtmlBlock html={slice.value} />)
                    }
                  </div>
                </Layout8>
              }

              {/* TODO: use one layout for all image weights if/when it's established
              that width isn't an adequate means to illustrate a difference */}
              {slice.type === 'picture' && slice.weight === 'default' &&
                <Layout10>
                  <CaptionedImage
                    {...slice.value}
                    sizesQueries={''} />
                </Layout10>
              }
              {slice.type === 'picture' && slice.weight === 'standalone' &&
                <Layout12>
                  <CaptionedImage
                    {...slice.value}
                    sizesQueries={''} />
                </Layout12>
              }
              {slice.type === 'picture' && slice.weight === 'supporting' &&
                <Layout8>
                  <CaptionedImage
                    {...slice.value}
                    sizesQueries={''} />
                </Layout8>
              }

              {slice.type === 'imageGallery' &&
                <ImageGalleryV2
                  isStandalone={slice.weight === 'standalone'}
                  {...slice.value}
                  id={imageGalleryIdCount++} />
              }

              {slice.type === 'quote' &&
                <Layout8>
                  <Quote {...slice.value} />
                </Layout8>
              }

              {slice.type === 'contentList' &&
                <Layout8>
                  <AsyncSearchResults
                    title={slice.value.title}
                    query={slice.value.items.map(({id}) => `id:${id}`).join(' ')} />
                </Layout8>
              }
              {slice.type === 'searchResults' &&
                <Layout8>
                  <AsyncSearchResults {...slice.value} />
                </Layout8>
              }
              {slice.type === 'videoEmbed' &&
                <Layout8>
                  <VideoEmbed {...slice.value} />
                </Layout8>
              }
              {slice.type === 'soundcloudEmbed' &&
                <Layout8>
                  <iframe width='100%' height='20' frameBorder='none' src={slice.value.embedUrl} />
                </Layout8>
              }

              {slice.type === 'map' &&
                <Layout8>
                  <Map {...slice.value} />
                </Layout8>
              }

              {slice.type === 'gifVideo' &&
                <Layout8>
                  <GifVideo {...slice.value} />
                </Layout8>
              }

              {slice.type === 'iframe' &&
                <Layout10>
                  <Iframe {...slice.value} />
                </Layout10>
              }

              {/* deprecated */}
              {slice.type === 'deprecatedImageList' &&
                <Layout8>
                  <DeprecatedImageList {...slice.value} />
                </Layout8>
              }
            </div>
          </SpacingComponent>
        )
        )}
    </div>
  );
};

export default Body;
