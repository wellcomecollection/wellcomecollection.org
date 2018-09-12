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
      'container': true,
      'basic-body': true,
      'bg-cream': isCreamy
    })}>
      {body.map((slice, i) =>
        <div className={`body-part ${spacing({s: 6}, {margin: ['top']})}`} key={`slice${i}`}>
          {slice.type === 'standfirst' &&
            <Layout8>
              <div className='body-text'>
                <FeaturedText html={slice.value} />
              </div>
            </Layout8>}
          {slice.type === 'text' &&
            <Layout8>
              <div className='body-text'>
                {slice.weight === 'featured' && <FeaturedText html={slice.value} />}
                {slice.weight !== 'featured' && <PrismicHtmlBlock html={slice.value} />}
              </div>
            </Layout8>
          }
          {/*
            not all featured image slices have their crops as they were only
            added in later.
          */}
          {slice.type === 'picture' &&
            slice.weight === 'featured' &&
            slice.value.image.crops.square &&
            <Layout12>
              <WobblyBottom color='cream'>
                <PictureFromImages images={{
                  [breakpoints.medium]: slice.value.image.crops['16:9'],
                  'default': slice.value.image.crops.square
                }} isFull={true} />
              </WobblyBottom>
            </Layout12>
          }
          {slice.type === 'picture' &&
            slice.weight === 'featured' &&
            !slice.value.image.crops.square &&
            <Layout12>
              <WobblyBottom color='cream'>
                <UiImage {...slice.value.image} isFull={true} />
              </WobblyBottom>
            </Layout12>
          }
          {slice.type === 'picture' && slice.weight !== 'featured' &&
            <Layout10>
              <CaptionedImage {...slice.value} sizesQueries={''} />
            </Layout10>
          }
          {slice.type === 'imageGallery' && <ImageGallery {...slice.value} />}
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
