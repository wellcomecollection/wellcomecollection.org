// @flow
import {Component} from 'react';
import {font} from '../../../utils/classnames';
import TextLayout from '../TextLayout/TextLayout';
import PrismicHtmlBlock from '../PrismicHtmlBlock/PrismicHtmlBlock';
import {UiImage} from '../Images/Images';
import type {UiCaptionedImageProps} from '../Images/Images';

type Props = {|
  items: UiCaptionedImageProps[]
|}

class ImageList extends Component<Props> {
  render() {
    const items = this.props.items;
    return <div style={{
      position: 'relative',
      paddingTop: '12px',
      paddingLeft: '12px',
      paddingRight: '12px',
      background: 'black'
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
                sizesQueries={''}
                extraClasses={'margin-center width-auto max-height-inherit'} />
            </div>
            <div className='HNL-' style={{
              // position: 'absolute',
              // bottom: 0,
              width: '100%',
              paddingTop: '12px'
            }}>
              <TextLayout>
                <div className={font({s: 'HNL4'})}>{i + 1} of {items.length}</div>
                <PrismicHtmlBlock html={captionedImage.caption} />
              </TextLayout>
            </div>
          </div>
        );
      })}
    </div>;
  }
}

export default ImageList;
