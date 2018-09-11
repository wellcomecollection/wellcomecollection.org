// @flow
// TODO: Sync up types with the body slices and the components they return
import {spacing} from '../../../utils/classnames';
import {breakpoints} from '../../../utils/breakpoints';
import AsyncSearchResults from '../SearchResults/AsyncSearchResults';
import {CaptionedImage, UiImage} from '../Images/Images';
import Quote from '../Quote/Quote';
import ImageGallery from '../ImageGallery/ImageGallery';
import PrismicHtmlBlock from '../PrismicHtmlBlock/PrismicHtmlBlock';
import FeaturedText from '../FeaturedText/FeaturedText';
import VideoEmbed from '../VideoEmbed/VideoEmbed';
import Map from '../Map/Map';
import WobblyBottom from '../WobblyBottom/WobblyBottom';
import {PictureFromImages} from '../Picture/Picture';
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
          {/*
            not all featured image slices have their crops as they were only
            added in later.
          */}
          {slice.type === 'picture' && slice.weight === 'featured' && slice.value.image.crops.square &&
            <BasePageColumn>
              <WobblyBottom>
                <PictureFromImages images={{
                  [breakpoints.medium]: slice.value.image.crops['16:9'],
                  'default': slice.value.image.crops.square
                }} isFull={true} />
              </WobblyBottom>
            </BasePageColumn>
          }
          {slice.type === 'picture' && slice.weight === 'featured' && !slice.value.image.crops.square &&
            <BasePageColumn>
              <WobblyBottom>
                <UiImage {...slice.value.image} isFull={true} />
              </WobblyBottom>
            </BasePageColumn>
          }
          {slice.type === 'picture' && slice.weight !== 'featured' &&
            <CaptionedImage {...slice.value} sizesQueries={''} />
          }
          {slice.type === 'imageGallery' && <ImageGallery {...slice.value} />}
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
