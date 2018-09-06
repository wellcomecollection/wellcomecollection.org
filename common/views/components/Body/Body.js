// @flow
// TODO: Sync up types with the body slices and the components they return
import {spacing} from '../../../utils/classnames';
import AsyncSearchResults from '../SearchResults/AsyncSearchResults';
import {CaptionedImage, UiImage} from '../Images/Images';
import Quote from '../Quote/Quote';
import ImageGallery from '../ImageGallery/ImageGallery';
import PrismicHtmlBlock from '../PrismicHtmlBlock/PrismicHtmlBlock';
import FeaturedText from '../FeaturedText/FeaturedText';
import VideoEmbed from '../VideoEmbed/VideoEmbed';
import Map from '../Map/Map';
import WobblyBottom from '../WobblyBottom/WobblyBottom';

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
            <div className='body-text'>
              {slice.weight === 'featured' && <FeaturedText html={slice.value} />}
              {slice.weight !== 'featured' && <PrismicHtmlBlock html={slice.value} />}
            </div>
          }
          {/*
            not all featured image slices have their crops as they were only
            added in later.
          */}
          {slice.type === 'picture' && slice.weight === 'featured' && slice.value.image.crops.square &&
            <WobblyBottom>
              <UiImage {...slice.value.image} isFull={true} />
            </WobblyBottom>
          }
          {slice.type === 'picture' && slice.weight === 'featured' && !slice.value.image.crops.square &&
            <WobblyBottom>
              <UiImage {...slice.value.image} isFull={true} />
            </WobblyBottom>
          }
          {slice.type === 'picture' && slice.weight !== 'featured' &&
            <CaptionedImage {...slice.value} sizesQueries={''} />
          }
          {slice.type === 'imageGallery' && <ImageGallery {...slice.value} />}
          {slice.type === 'quote' && <Quote {...slice.value} />}
          {slice.type === 'contentList' &&
            <AsyncSearchResults
              title={slice.value.title}
              query={slice.value.items.map(({id}) => `id:${id}`).join(' ')}
            />}
          {slice.type === 'searchResults' && <AsyncSearchResults {...slice.value} />}
          {slice.type === 'videoEmbed' && <VideoEmbed {...slice.value} />}
          {slice.type === 'map' && <Map {...slice.value} />}
        </div>
      )}
    </div>
  );
};

export default Body;
