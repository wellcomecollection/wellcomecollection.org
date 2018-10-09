// @flow
// TODO: Sync up types with the body slices and the components they return
import {spacing, classNames} from '../../../utils/classnames';
import AsyncSearchResults from '../SearchResults/AsyncSearchResults';
import {CaptionedImage} from '../Images/Images';
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
import type {Weight} from '../../../services/prismic/parsers';

type BodySlice = {|
  type: string,
  weight: Weight,
  value: any
|}

export type BodyType = BodySlice[]

type Props = {|
  body: BodyType
|}

const Body = ({ body }: Props) => {
  return (
    <div className={classNames({
      'basic-body': true
    })}>
      {body
        .filter(slice => !(slice.type === 'picture' && slice.weight === 'featured'))
        // The standfirst is now put into the header, and used exclusively by articles
        .filter(slice => slice.type !== 'standfirst')
        .map((slice, i) =>
          <div className={classNames({
            'body-part': true,
            [spacing({s: 3}, {padding: ['top']})]: i === 0 && slice.type !== 'imageGallery',
            'overflow-hidden': true
          })} key={`slice${i}`}>
            {slice.type === 'standfirst' &&
              <Layout8>
                <div className='body-text'>
                  <FeaturedText html={slice.value} />
                </div>
              </Layout8>
            }
            {slice.type === 'text' &&
              <Layout8>
                <div className='body-text'>
                  {slice.weight === 'featured' && <FeaturedText html={slice.value} />}
                  {slice.weight !== 'featured' && <PrismicHtmlBlock html={slice.value} />}
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
                {...slice.value} />
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
                  query={slice.value.items.map(({id}) => `id:${id}`).join(' ')}
                />
              </Layout8>
            }
            {slice.type === 'searchResults' &&
              <Layout8>
                <AsyncSearchResults {...slice.value} />
              </Layout8>
            }
            {slice.type === 'videoEmbed' &&
              <Layout8>
                <div className={classNames({
                  [spacing({s: 6}, {margin: ['bottom']})]: true
                })}>
                  <VideoEmbed {...slice.value} />
                </div>
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

            {/* deprecated */}
            {slice.type === 'deprecatedImageList' &&
              <Layout8>
                <DeprecatedImageList {...slice.value} />
              </Layout8>
            }
          </div>
        )}
    </div>
  );
};

export default Body;
