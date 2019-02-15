// @flow
// TODO: use styled components
import { Fragment, Component, createRef } from 'react';
import { font, spacing, classNames } from '../../../utils/classnames';
import { CaptionedImage } from '../Images/Images';
import WobblyEdge from '../WobblyEdge/WobblyEdge';
import Button from '../Buttons/Button/Button';
import Control from '../Buttons/Control/Control';
import Icon from '../Icon/Icon';
import Layout12 from '../Layout12/Layout12';
import type { CaptionedImage as CaptionedImageProps } from '../../../model/captioned-image';
import { PageBackgroundContext } from '../ContentPage/ContentPage';
import { repeatingLsBlack } from '../../../utils/backgrounds';
import { breakpoints } from '../../../utils/breakpoints';
import { trackEvent } from '../../../utils/ga';

type Props = {|
  id: string,
  title: ?string,
  items: CaptionedImageProps[],
  isStandalone: boolean,
|};

type State = {|
  isActive: boolean,
  titleStyle: ?{| transform: string, maxWidth: string, opacity: number |},
|};

class ImageGallery extends Component<Props, State> {
  state = {
    isActive: true,
    titleStyle: null,
  };

  openButtonRef: {
    current: HTMLAnchorElement | HTMLButtonElement | null,
  } = createRef();

  closeButtonRef: {
    current: HTMLAnchorElement | HTMLButtonElement | null,
  } = createRef();

  focusOpenButton = () => {
    this.openButtonRef.current && this.openButtonRef.current.focus();
  };

  focusCloseButton = () => {
    this.closeButtonRef.current && this.closeButtonRef.current.focus();
  };

  showAllImages = (isButton?: boolean) => {
    trackEvent({
      category: `${isButton ? 'Button' : 'CaptionedImage'}`,
      action: 'open ImageGallery',
      label: this.props.id,
    });
    this.setState({
      isActive: true,
    });
  };

  itemsToShow = () => {
    return this.state.isActive ? this.props.items : [this.props.items[0]];
  };

  componentDidMount() {
    !this.props.isStandalone &&
      this.setState({
        isActive: false,
      });
  }

  // We want the image gallery title to be aligned with the first image
  // So we adjust the translateX and width accordingly
  setTitleStyle = (value: number) => {
    this.setState({
      titleStyle: {
        transform: `translateX(calc((100vw - ${value}px) / 2))`,
        maxWidth: `${value}px`,
        opacity: 1,
      },
    });
  };

  render() {
    const { title, items, isStandalone, id } = this.props;
    const { isActive, titleStyle } = this.state;

    return (
      <PageBackgroundContext.Consumer>
        {theme => (
          <Fragment>
            {!isStandalone && (
              <span
                style={titleStyle}
                className={classNames({
                  'flex flex--v-top image-gallery-v2-title': true,
                  [spacing({ s: 4 }, { margin: ['bottom'] })]: true,
                })}
              >
                <Icon
                  name="gallery"
                  extraClasses={`${spacing({ s: 1 }, { margin: ['right'] })}`}
                />
                <h2 id={`gallery-${id}`} className="h2 no-margin">
                  {title || 'In pictures'}
                </h2>
              </span>
            )}
            <div
              id={`image-gallery-${id}`}
              className={classNames({
                'image-gallery-v2--standalone': isStandalone,
                'image-gallery-v2 row relative': true,
                'is-active font-white': isActive,
              })}
            >
              <div
                className={classNames({
                  'absolute image-gallery-v2__background': true,
                  'image-gallery-v2__background--standalone': isStandalone,
                })}
                style={{
                  bottom: 0,
                  width: `100%`,
                  background: `url(${repeatingLsBlack}) no-repeat top center`,
                }}
              />
              <Layout12>
                <div
                  className={classNames({
                    relative: true,
                    [spacing(
                      { s: 5, m: 10 },
                      { padding: ['top'] }
                    )]: isStandalone,
                  })}
                >
                  {isStandalone && (
                    <div className="absolute image-gallery-v2__standalone-wobbly-edge">
                      <WobblyEdge
                        extraClasses="wobbly-edge--rotated"
                        background={'white'}
                      />
                    </div>
                  )}
                  {!isActive && (
                    <Fragment>
                      <div className="image-gallery-v2__wobbly-edge absolute">
                        <WobblyEdge background={theme} />
                      </div>
                    </Fragment>
                  )}

                  {!isStandalone && (
                    <div
                      className={classNames({
                        [spacing({ s: 3 }, { padding: ['top'] })]: true,
                        'image-gallery-v2__close-wrapper absolute': true,
                      })}
                    >
                      <div
                        className={classNames({
                          'flex flex-end': true,
                          'image-gallery-v2__close': true,
                          hidden: !isActive,
                          [spacing(
                            { s: 3 },
                            { padding: ['right', 'bottom'] }
                          )]: true,
                        })}
                      >
                        <Control
                          ariaControls={`image-gallery-${id}`}
                          ariaExpanded={isActive}
                          ref={this.closeButtonRef}
                          url={`#gallery-${id}`}
                          type={`light`}
                          text={`close`}
                          icon={`cross`}
                          clickHandler={event => {
                            trackEvent({
                              category: `Control`,
                              action: 'close ImageGallery',
                              label: this.props.id,
                            });
                            this.setState({ isActive: false });
                            this.focusOpenButton();
                          }}
                        />
                      </div>
                    </div>
                  )}
                  {this.itemsToShow().map((captionedImage, i) => (
                    <div
                      onClick={() => {
                        if (!isActive) {
                          this.showAllImages();
                          this.focusCloseButton();
                        }
                      }}
                      className={classNames({
                        [spacing({ s: 10 }, { margin: ['bottom'] })]: isActive,
                      })}
                      key={captionedImage.image.contentUrl}
                      style={{
                        cursor: !isActive ? 'pointer' : 'default',
                      }}
                    >
                      <CaptionedImage
                        image={captionedImage.image}
                        caption={captionedImage.caption}
                        setTitleStyle={i === 0 ? this.setTitleStyle : undefined}
                        sizesQueries={`
                          (min-width: ${breakpoints.xlarge}) calc(${
                          breakpoints.xlarge
                        } - 120px),
                          calc(100vw - 84px)
                        `}
                        preCaptionNode={
                          items.length > 1 ? (
                            <div
                              className={classNames({
                                [font({ s: 'HNM5', m: 'HNM4' })]: true,
                                [spacing(
                                  { s: 2 },
                                  { margin: ['bottom'] }
                                )]: true,
                              })}
                            >
                              <span className="visually-hidden">slide </span>
                              {i + 1} of {items.length}
                            </div>
                          ) : null
                        }
                      />
                    </div>
                  ))}

                  {titleStyle && (
                    <Button
                      ref={this.openButtonRef}
                      ariaControls={`image-gallery-${id}`}
                      ariaExpanded={isActive}
                      type="primary"
                      icon="gallery"
                      clickHandler={() => {
                        this.showAllImages(true);
                        this.focusCloseButton();
                      }}
                      extraClasses={classNames({
                        'image-gallery-v2__button absolute': true,
                        hidden: isActive,
                      })}
                      text={`${items.length} images`}
                    />
                  )}
                </div>
              </Layout12>
            </div>
          </Fragment>
        )}
      </PageBackgroundContext.Consumer>
    );
  }
}

export default ImageGallery;
