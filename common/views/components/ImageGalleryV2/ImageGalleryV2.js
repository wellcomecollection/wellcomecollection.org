// @flow
import {Fragment, Component} from 'react';
import {font, spacing, classNames} from '../../../utils/classnames';
import {CaptionedImage} from '../Images/Images';
import WobblyEdge from '../WobblyEdge/WobblyEdge';
import Button from '../Buttons/Button/Button';
import Layout12 from '../Layout12/Layout12';
import type {CaptionedImage as CaptionedImageProps} from '../../../model/captioned-image';

type Props = {|
  id: string,
  title: ?string,
  items: CaptionedImageProps[]
|}

type State = {|
  isActive: boolean
|}

class ImageGallery extends Component<Props, State> {
  state = {
    isActive: false
  }

  showAllImages = () => {
    this.setState({
      isActive: true
    });
  }

  render() {
    const { title, items } = this.props;
    const { isActive } = this.state;

    return (
      <div className={classNames({
        [spacing({s: 4}, {padding: ['top']})]: true,
        [spacing({s: 10}, {margin: ['bottom']})]: true,
        'image-gallery-v2 row relative': true,
        'is-active bg-charcoal font-white': isActive
      })}>
        <Layout12>
          <div className={`relative`}>
            {!isActive &&
              <Fragment>
                <div className='image-gallery-v2__wobbly-edge absolute'>
                  <WobblyEdge
                    intensity={40}
                    background='cream' />
                </div>
                <div className='image-gallery-v2__gradient absolute'></div>
              </Fragment>
            }
            <div className={`image-gallery-v2__inner`}>
              <h2 className='h2'>{title || 'In pictures'}</h2>
              {items.map((captionedImage, i) => (
                <div className={spacing({s: 10}, {margin: ['bottom']})} key={captionedImage.image.contentUrl}>
                  <CaptionedImage
                    image={captionedImage.image}
                    caption={captionedImage.caption}
                    preCaptionNode={
                      <div className={classNames({
                        [font({s: 'HNM5', m: 'HNM4'})]: true,
                        [spacing({s: 2}, {margin: ['bottom']})]: true
                      })}>
                        <span className='visually-hidden'>slide </span>{i + 1} of {items.length}
                      </div>
                    }>
                  </CaptionedImage>
                </div>
              ))}
            </div>
            {!isActive &&
          <Button
            type='primary'
            icon='plus'
            clickHandler={this.showAllImages}
            extraClasses='image-gallery-v2__button absolute'
            text={`${items.length} images`} />
            }
          </div>
        </Layout12>
      </div>
    );
  }
};

export default ImageGallery;
