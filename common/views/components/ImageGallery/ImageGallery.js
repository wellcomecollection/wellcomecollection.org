// @flow
// TODO: use styled components
import { Fragment, Component, createRef } from 'react';
import { font, classNames } from '../../../utils/classnames';
import { CaptionedImage } from '../Images/Images';
// $FlowFixMe (tsx)
import WobblyEdge from '../WobblyEdge/WobblyEdge';
// $FlowFixMe (tsx)
import ButtonSolid from '../ButtonSolid/ButtonSolid';
// $FlowFixMe (tsx)
import Control from '../Buttons/Control/Control';
// $FlowFixMe (tsx)
import Icon from '../Icon/Icon';
// $FlowFixMe (tsx)
import Layout12 from '../Layout12/Layout12';
import type { CaptionedImage as CaptionedImageProps } from '../../../model/captioned-image';
// $FlowFixMe (tsx)
import { PageBackgroundContext } from '../ContentPage/ContentPage';
// $FlowFixMe (ts)
import { repeatingLsBlack } from '../../../utils/backgrounds';
// $FlowFixMe (ts)
import { breakpoints } from '../../../utils/breakpoints';
import { trackEvent } from '../../../utils/ga';
// $FlowFixMe (tsx)
import Space from '../styled/Space';
import styled from 'styled-components';

const GalleryTitle = styled(Space).attrs(props => ({
  v: { size: 'm', properties: ['margin-bottom'] },
  as: 'span',
  style: props.titleStyle,
  className: classNames({
    'flex flex--v-top': true,
  }),
}))`
  ${props =>
    props.isEnhanced &&
    `
    opacity: 0;
  `}
`;

const Gallery = styled.div.attrs({
  className: 'row relative',
})`
  .caption {
    display: none;
  }

  .tasl {
    display: none;
  }

  ${props =>
    props.isActive &&
    `
    .caption {
      display: block;
    }

    .tasl {
      display: inherit;
    }

    color: ${props.theme.color('white')};
    background: linear-gradient(
      ${props.theme.color('cream')} 100px,
      ${props.theme.color('charcoal')} 100px
    );

    @media (min-width: ${props.theme.sizes.medium}px) {
      background: linear-gradient(
        ${props.theme.color('cream')} 200px,
        ${props.theme.color('charcoal')} 200px
      );

      ${props.isStandalone &&
        `
        background: ${props.theme.color('charcoal')};
      `}
    }

    .captioned-image__image-container {
      background: ${props.theme.color('charcoal')};

      &:before {
        display: none;
      }
      &:hover:before {
        opacity: 0;
      }
    }
  `}

  .captioned-image__image-container {
    &:before {
      content: '';
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      opacity: 0;
      background: ${props => props.theme.color('charcoal')};
      transition: opacity 400ms ease;
    }

    &:hover:before {
      opacity: 0.3;
    }
  }

  &:before {
    content: '';
    position: absolute;
    top: 100px;
    right: 0;
    left: 0;
    bottom: 0;
    transition: all 400ms ease;

    @include respond-to('medium') {
      top: 200px;
    }
  }

  transition: all 400ms ease;

  ${props =>
    props.isStandalone &&
    `
    background: ${props.theme.color('charcoal')};

    &:before {
      top: 0;

      @media (min-width: ${props.theme.sizes.medium}px) {
        top: 0;
      }
    }
  `}

  .close-wrapper {
    display: none;

    .enhanced & {
      display: inherit;
      top: 100px;
      bottom: 0;
      width: 100%;
      pointer-events: none;

      @media (min-width: ${props => props.theme.sizes.medium}px) {
        top: 200px;
      }
    }
  }

  .close {
    position: sticky;
    top: 18px;
    transform: translateX(calc((100vw - 100%) / 2));
    z-index: 3;
    pointer-events: all;
  }

  .background {
    top: 100px;
    opacity: 0;
    transition: opacity 400ms ease;

    @media (min-width: ${props => props.theme.sizes.medium}px) {
      top: 200px;

      ${props =>
        props.isStandalone &&
        `
        top: 0;
      `}

      ${props =>
        props.isActive &&
        `
        opacity: 0.1;
      `}
    }

    ${props =>
      props.isActive &&
      `
      opacity: 0.1;
    `}

    ${props =>
      props.isStandalone &&
      `
      top: 0;
    `}
  }

  .standalone-wobbly-edge {
    top: 0;
    width: 100%;
    z-index: 2;
  }

  .wobbly-edge-wrapper {
    bottom: -2px;
    width: 100%;
  }
`;

const ButtonContainer = styled.div`
  display: ${props => (props.isHidden ? 'none' : 'block')};
  position: absolute;
  bottom: 24px;
  left: 50%;
  transform: translateX(-50%) translateY(50%);
  z-index: 2;
`;

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
    current: HTMLButtonElement | HTMLAnchorElement | null,
  } = createRef();

  closeButtonRef: {
    current: HTMLAnchorElement | HTMLButtonElement | null,
  } = createRef();

  headingRef: {
    current: HTMLHeadingElement | null,
  } = createRef();

  handleOpenClicked() {
    if (this.closeButtonRef.current) {
      this.closeButtonRef.current.tabIndex = 0;
      this.closeButtonRef.current.focus();
      this.showAllImages(true);
    }

    if (this.openButtonRef.current) {
      this.openButtonRef.current.tabIndex = -1;
    }
  }

  handleCloseClicked() {
    if (this.openButtonRef.current) {
      this.openButtonRef.current.tabIndex = 0;
      this.setState({ isActive: false });

      if (this.headingRef.current) {
        this.headingRef.current.scrollIntoView();
      }

      trackEvent({
        category: `Control`,
        action: 'close ImageGallery',
        label: this.props.id,
      });
    }

    if (this.closeButtonRef.current) {
      this.closeButtonRef.current.tabIndex = -1;
    }
  }

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
              <GalleryTitle titleStyle={titleStyle}>
                <Space
                  as="span"
                  h={{ size: 's', properties: ['margin-right'] }}
                >
                  <Icon name="gallery" />
                </Space>
                <h2
                  id={`gallery-${id}`}
                  className="h2 no-margin"
                  ref={this.headingRef}
                >
                  {title || 'In pictures'}
                </h2>
              </GalleryTitle>
            )}
            <Gallery
              isActive={isActive}
              isStandalone={isStandalone}
              id={`image-gallery-${id}`}
            >
              <div
                className={classNames({
                  'absolute background': true,
                })}
                style={{
                  bottom: 0,
                  width: `100%`,
                  background: `url(${repeatingLsBlack}) no-repeat top center`,
                }}
              />
              <Layout12>
                <Space
                  v={
                    isStandalone
                      ? {
                          size: 'xl',
                          properties: ['padding-top'],
                        }
                      : undefined
                  }
                  className={classNames({
                    relative: true,
                  })}
                >
                  {isStandalone && (
                    <div className="absolute standalone-wobbly-edge">
                      <WobblyEdge
                        extraClasses="wobbly-edge--rotated"
                        background={'white'}
                      />
                    </div>
                  )}
                  {!isActive && (
                    <Fragment>
                      <div className="wobbly-edge-wrapper absolute">
                        <WobblyEdge background={theme} />
                      </div>
                    </Fragment>
                  )}

                  {!isStandalone && (
                    <Space
                      v={{
                        size: 'm',
                        properties: ['padding-top'],
                      }}
                      className={classNames({
                        'close-wrapper absolute': true,
                      })}
                    >
                      <Space
                        v={{
                          size: 'm',
                          properties: ['padding-bottom'],
                        }}
                        h={{ size: 'm', properties: ['padding-right'] }}
                        className={classNames({
                          'flex flex-end': true,
                          close: true,
                          'is-hidden': !isActive,
                        })}
                      >
                        <Control
                          tabIndex={`-1`}
                          ariaControls={`image-gallery-${id}`}
                          ariaExpanded={isActive}
                          ref={this.closeButtonRef}
                          replace={true}
                          colorScheme={`light`}
                          text={`close`}
                          icon={`cross`}
                          clickHandler={() => {
                            this.handleCloseClicked();
                          }}
                        />
                      </Space>
                    </Space>
                  )}
                  {this.itemsToShow().map((captionedImage, i) => (
                    <Space
                      v={
                        isActive
                          ? {
                              size: 'xl',
                              properties: ['margin-bottom'],
                            }
                          : undefined
                      }
                      onClick={() => {
                        if (!isActive) {
                          this.handleOpenClicked();
                        }
                      }}
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
                          (min-width: ${breakpoints.xlarge}) calc(${breakpoints.xlarge} - 120px),
                          calc(100vw - 84px)
                        `}
                        preCaptionNode={
                          items.length > 1 ? (
                            <Space
                              v={{
                                size: 'm',
                                properties: ['margin-bottom'],
                              }}
                              className={classNames({
                                [font('hnb', 5)]: true,
                              })}
                            >
                              {i + 1} of {items.length}
                            </Space>
                          ) : null
                        }
                      />
                    </Space>
                  ))}

                  {titleStyle && (
                    <ButtonContainer isHidden={isActive}>
                      <ButtonSolid
                        ref={this.openButtonRef}
                        ariaControls={`image-gallery-${id}`}
                        ariaExpanded={isActive}
                        icon="gallery"
                        clickHandler={() => {
                          this.handleOpenClicked();
                        }}
                        text={`${items.length} images`}
                      />
                    </ButtonContainer>
                  )}
                </Space>
              </Layout12>
            </Gallery>
          </Fragment>
        )}
      </PageBackgroundContext.Consumer>
    );
  }
}

export default ImageGallery;
