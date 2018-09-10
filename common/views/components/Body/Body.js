// @flow
// TODO: Sync up types with the body slices and the components they return
import {spacing} from '../../../utils/classnames';
import AsyncSearchResults from '../SearchResults/AsyncSearchResults';
import {CaptionedImage} from '../Images/Images';
import Quote from '../Quote/Quote';
import ImageGallery from '../ImageGallery/ImageGallery';
import PrismicHtmlBlock from '../PrismicHtmlBlock/PrismicHtmlBlock';
import FeaturedText from '../FeaturedText/FeaturedText';
import VideoEmbed from '../VideoEmbed/VideoEmbed';
import Map from '../Map/Map';
import {BasePageColumn} from '../BasePage/BasePage';
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
    <div className='basic-body'>
      {body.map((slice, i) =>
        <div className={`body-part ${spacing({s: 6}, {margin: ['top']})}`} key={`slice${i}`}>
          {slice.type === 'text' &&
            <BasePageColumn>
              <div className='body-text'>
                {slice.weight === 'featured' && <FeaturedText html={slice.value} />}
                {slice.weight !== 'featured' && <PrismicHtmlBlock html={slice.value} />}
              </div>
            </BasePageColumn>
          }
          {slice.type === 'picture' &&
            <BasePageColumn>
              <CaptionedImage {...slice.value} sizesQueries={''} />
            </BasePageColumn>
          }
          {slice.type === 'imageGallery' &&
            <BasePageColumn>
              <ImageGallery {...slice.value} />
            </BasePageColumn>
          }
          {slice.type === 'quote' &&
            <BasePageColumn>
              <Quote {...slice.value} />
            </BasePageColumn>
          }

          {slice.type === 'contentList' &&
            <BasePageColumn>
              <AsyncSearchResults
                title={slice.value.title}
                query={slice.value.items.map(({id}) => `id:${id}`).join(' ')}
              />
            </BasePageColumn>
          }
          {slice.type === 'searchResults' &&
            <BasePageColumn>
              <AsyncSearchResults {...slice.value} />
            </BasePageColumn>
          }
          {slice.type === 'videoEmbed' &&
            <BasePageColumn>
              <VideoEmbed {...slice.value} />
            </BasePageColumn>
          }
          {slice.type === 'map' &&
            <BasePageColumn>
              <Map {...slice.value} />
            </BasePageColumn>
          }
        </div>
      )}
    </div>
  );
};

export default Body;
