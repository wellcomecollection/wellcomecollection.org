// @flow
import {Fragment, Component} from 'react';
import {font, spacing, classNames} from '../../../utils/classnames';
import {CaptionedImage} from '../Images/Images';
import Icon from '../Icon/Icon';
import WobblyEdge from '../WobblyEdge/WobblyEdge';
import Control from '../Buttons/Control/Control';
import Layout8 from '../Layout8/Layout8';
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
    isActive: true
  }

  showAllImages = () => {
    this.setState({
      isActive: true
    });
  }

  componentDidMount() {
    this.setState({
      isActive: false
    });
  }

  render() {
    const { title, items } = this.props;
    const { isActive } = this.state;

    return (
      <Fragment>
        <Layout8>
          <span className='flex flex--v-center'>
            <Icon name='gallery' extraClasses={spacing({s: 1}, {margin: ['right']})} />
            <span className={font({s: 'HNL5', m: 'HNL4'})}>{items.length} images</span>
          </span>
          <h2 className='h2'>{title || 'In pictures'}</h2>
        </Layout8>
        <div className={classNames({
          [spacing({s: 10}, {margin: ['bottom']})]: true,
          'image-gallery-v2 row relative': true,
          'is-active font-white': isActive
        })}>
          <Layout12>
            <div className={`relative`}>
              {!isActive &&
                <Fragment>
                  <div className='image-gallery-v2__wobbly-edge absolute'>
                    <WobblyEdge
                      intensity={20}
                      isValley={true}
                      background='cream' />
                  </div>
                </Fragment>
              }
              <div
                onClick={this.showAllImages}
                className={`image-gallery-v2__inner`}>
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
                <Control
                  type='dark'
                  icon='plus'
                  clickHandler={this.showAllImages}
                  extraClasses='image-gallery-v2__button absolute'
                  text={`${items.length} images`} />
              }
            </div>
          </Layout12>
        </div>
      </Fragment>
    );
  }
};

export default ImageGallery;
