// @flow
// TODO: Sync up types with the body slices and the components they return
import {Fragment, Component} from 'react';
import {spacing, classNames, font} from '../../../utils/classnames';
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
  state = {showCaptions: true}
  render() {
    const items = this.props.items;

    return <div style={{
      position: 'relative',
      paddingTop: '12px',
      paddingLeft: '12px',
      paddingRight: '12px'
    }}>
      {items.map((captionedImage, i) => {
        return (
          <div key={i} className='font-white' style={{
            marginBottom: '60px'
          }}>
            <div style={{
              maxHeight: 'calc(100vh - 55px)', // The bar at the bottom
              position: 'relative'
            }}>
              <UiImage
                {...captionedImage.image}
                extraClasses={'margin-center width-auto max-height-inherit'} />
            </div>
            {this.state.showCaptions &&
              <div className='HNL-' style={{
                // position: 'absolute',
                // bottom: 0,
                background: 'rgba(0, 0, 0, 0.6)',
                width: '100%',
                paddingTop: '12px'
              }}>
                <TextLayout>
                  <div className={font({s: 'HNL4'})}>{i + 1} of {items.length}</div>
                  <PrismicHtmlBlock html={captionedImage.caption} />
                </TextLayout>
              </div>
            }
          </div>
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
          borderTop: 'solid white 1px',
          display: 'none'
        }}>
        <TextLayout>
          <label>
            <input checked={this.state.showCaptions} type='checkbox' onChange={(e) => {
              this.setState({showCaptions: e.target.checked});
            }} style={{marginRight: '12px'}} />
            Show captions
          </label>
        </TextLayout>
      </div>
    </div>;
  }
}

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
          {slice.type === 'imageGallery' && <Fragment>
            <div className='bg-black'><ImageGallery items={slice.value.items} /></div>
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
