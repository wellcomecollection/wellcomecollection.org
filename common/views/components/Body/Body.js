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
import Map from '../Map/Map';
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
  body: BodyType,
  isCreamy?: boolean
|}

const Body = ({ body, isCreamy = false }: Props) => {
  return (
    <div className={classNames({
      'basic-body': true,
      'bg-cream': isCreamy,
      [spacing({s: 3}, {padding: ['top']})]: true
    })}>
      {body
        .filter(slice => !(slice.type === 'picture' && slice.weight === 'featured'))
        .map((slice, i) =>
          <div className={classNames({
            'body-part': true
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

            {slice.type === 'picture' && slice.weight === 'default' &&
              <Layout10>
                <CaptionedImage {...slice.value} sizesQueries={''} maxHeightRestricted={true} />
              </Layout10>
            }
            {slice.type === 'picture' && slice.weight === 'standalone' &&
              <Layout12>
                <CaptionedImage {...slice.value} sizesQueries={''} maxHeightRestricted={true} />
              </Layout12>
            }
            {slice.type === 'picture' && slice.weight === 'supporting' &&
              <Layout8>
                <CaptionedImage {...slice.value} sizesQueries={''} maxHeightRestricted={true} />
              </Layout8>
            }

            {slice.type === 'imageGallery' && <ImageGalleryV2 {...slice.value} />}
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
                <VideoEmbed {...slice.value} />
              </Layout8>
            }
            {slice.type === 'map' &&
              <Layout8>
                <Map {...slice.value} />
              </Layout8>
            }
          </div>
        )}
    </div>
  );
};

export default Body;
