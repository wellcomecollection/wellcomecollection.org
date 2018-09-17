// @flow
// TODO: Sync up types with the body slices and the components they return
import {spacing, classNames} from '../../../utils/classnames';
import AsyncSearchResults from '../SearchResults/AsyncSearchResults';
import {CaptionedImage} from '../Images/Images';
import Quote from '../Quote/Quote';
import ImageGallery from '../ImageGallery/ImageGallery';
import PrismicHtmlBlock from '../PrismicHtmlBlock/PrismicHtmlBlock';
import FeaturedText from '../FeaturedText/FeaturedText';
import VideoEmbed from '../VideoEmbed/VideoEmbed';
import Map from '../Map/Map';
import TextLayout from '../TextLayout/TextLayout';
import MaxL10Layout from '../MaxL10Layout/MaxL10Layout';
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
            We leave featured images out for now, the only time they were ever used
            as different images to the promo image was webcomics
          */}
          {slice.type === 'picture' && slice.weight !== 'featured' &&
            <MaxL10Layout>
              <CaptionedImage {...slice.value} sizesQueries={''} />
            </MaxL10Layout>
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
