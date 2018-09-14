// @flow
// TODO: Sync up types with the body slices and the components they return
import {Fragment, Component} from 'react';
import {spacing, classNames} from '../../../utils/classnames';
import {breakpoints} from '../../../utils/breakpoints';
import AsyncSearchResults from '../SearchResults/AsyncSearchResults';
import {CaptionedImage, UiImage} from '../Images/Images';
import Quote from '../Quote/Quote';
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

class ImageGallery extends Component {
  render() {
    const items = this.props.items;

    return <div style={{position: 'relative'}}>
      {this.props.items.map((captionedImage, i) => {
        const caption = `${i + 1}/${items.length} ${captionedImage.caption[0].text}`;
        captionedImage.caption[0] = {...captionedImage.caption[0], text: caption};
        return (
          <Fragment key={i}>
            <div style={{
              maxHeight: '100vh',
              marginTop: '120px',
              position: 'relative'
            }}>
              <UiImage
                {...captionedImage.image}
                extraClasses={'margin-center width-auto max-height-inherit'} />

              <div className='font-white flex' style={{
                position: 'absolute',
                bottom: 0,
                background: 'rgba(0, 0, 0, 0.6)',
                width: '100%',
                paddingTop: '12px'
              }}>
                <TextLayout><PrismicHtmlBlock html={captionedImage.caption} /></TextLayout>
              </div>
            </div>
          </Fragment>
        );
      })}
      <div
        className={'font-white'}
        style={{
          position: 'sticky',
          bottom: 0,
          color: 'white',
          background: 'black',
          paddingTop: '12px',
          paddingBottom: '12px',
          borderTop: 'solid white 1px'
        }}>
        <TextLayout>
          <label><input type='checkbox' onChange={(e) => {
            console.info('things', e.target.checked);
          }} />Captions</label>
        </TextLayout>
      </div>
    </div>;
  }
}

const Body = ({ body, isCreamy = false }: Props) => {
  return (
    <div className={classNames({
      'basic-body': true,
      'bg-black': isCreamy
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
          {slice.type === 'imageGallery' && <Fragment>
            <ImageGallery items={slice.value.items} />
          </Fragment>}
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
