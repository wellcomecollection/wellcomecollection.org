// @flow
// TODO: Sync up types with the body slices and the components they return
import {spacing, classNames} from '../../../utils/classnames';
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
import TextLayout from '../TextLayout/TextLayout';
import ImageLayout from '../ImageLayout/ImageLayout';
import FullWidthLayout from '../FullWidthLayout/FullWidthLayout';
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
      'bg-cream': isCreamy
    })}>
      {body.map((slice, i) =>
        <div className={`body-part ${spacing({s: 6}, {margin: ['top']})}`} key={`slice${i}`}>
          {slice.type === 'standfirst' &&
            <TextLayout>
              <div className='body-text'>
                <FeaturedText html={slice.value} />
              </div>
            </TextLayout>}
          {slice.type === 'text' &&
            <TextLayout>
              <div className='body-text'>
                {slice.weight === 'featured' && <FeaturedText html={slice.value} />}
                {slice.weight !== 'featured' && <PrismicHtmlBlock html={slice.value} />}
              </div>
            </TextLayout>
          }
          {/*
            not all featured image slices have their crops as they were only
            added in later.
          */}
          {slice.type === 'picture' &&
            slice.weight === 'featured' &&
            slice.value.image.crops.square &&
            <FullWidthLayout>
              <WobblyBottom color='cream'>
                <PictureFromImages images={{
                  [breakpoints.medium]: slice.value.image.crops['16:9'],
                  'default': slice.value.image.crops.square
                }} isFull={true} />
              </WobblyBottom>
            </FullWidthLayout>
          }
          {slice.type === 'picture' &&
            slice.weight === 'featured' &&
            !slice.value.image.crops.square &&
            <FullWidthLayout>
              <WobblyBottom color='cream'>
                <UiImage {...slice.value.image} isFull={true} />
              </WobblyBottom>
            </FullWidthLayout>
          }
          {slice.type === 'picture' && slice.weight !== 'featured' &&
            <ImageLayout>
              <CaptionedImage {...slice.value} sizesQueries={''} />
            </ImageLayout>
          }
          {slice.type === 'imageGallery' && <ImageGallery {...slice.value} />}
          {slice.type === 'quote' &&
            <TextLayout>
              <Quote {...slice.value} />
            </TextLayout>
          }

          {slice.type === 'contentList' &&
            <TextLayout>
              <AsyncSearchResults
                title={slice.value.title}
                query={slice.value.items.map(({id}) => `id:${id}`).join(' ')}
              />
            </TextLayout>
          }
          {slice.type === 'searchResults' &&
            <TextLayout>
              <AsyncSearchResults {...slice.value} />
            </TextLayout>
          }
          {slice.type === 'videoEmbed' &&
            <TextLayout>
              <VideoEmbed {...slice.value} />
            </TextLayout>
          }
          {slice.type === 'map' &&
            <TextLayout>
              <Map {...slice.value} />
            </TextLayout>
          }
        </div>
      )}
    </div>
  );
};

export default Body;
