// @flow
import React, {Fragment} from 'react';
import {Transition} from 'react-transition-group';
import Image from '../Image/Image';
import ButtonButton from '../Buttons/ButtonButton/ButtonButton';
import {font, spacing} from '../../../utils/classnames';
import dynamic from 'next/dynamic';
import ReactGA from 'react-ga';
const ImageViewerImage = dynamic(import('./ImageViewerImage'));

type LaunchViewerButtonProps = {|
  classes: string,
  clickHandler: Function,
  didMountHandler: Function
|}

class LaunchViewerButton extends React.Component<LaunchViewerButtonProps> {
  componentDidMount() {
    this.props.didMountHandler();
  }

  render() {
    return (
      <ButtonButton
        text='View larger image'
        icon='zoomIn'
        extraClasses={`${this.props.classes} ${font({s: 'HNM5'})} btn--round image-viewer__launch-button js-image-viewer__launch-button`}
        clickHandler={this.props.clickHandler}
      />
    );
  }
};

const buttonFontClasses = font({s: 'HNM5'});

type ViewerContentProps = {|
  id: string,
  contentUrl: string,
  classes: string,
  viewerVisible: boolean,
  handleViewerDisplay: Function
|}

class ViewerContent extends React.Component<ViewerContentProps> {
  escapeCloseViewer: Function;

  constructor(props) {
    super(props);

    this.escapeCloseViewer = this.escapeCloseViewer.bind(this);
  }

  escapeCloseViewer({keyCode}: KeyboardEvent) {
    if (keyCode === 27 && this.props.viewerVisible) {
      this.props.handleViewerDisplay();
    }
  }

  componentDidMount() {
    document.addEventListener('keydown', this.escapeCloseViewer);
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.escapeCloseViewer);
  }

  handleZoom = (event: {currentTarget: {title: string}}) => {
    const isZoomIn = event.currentTarget.title === 'Zoom in';

    ReactGA.event({
      category: 'component',
      action: `ZoomImageViewer:${isZoomIn ? 'did zoom in' : 'did zoom out'}`,
      label: `id:${this.props.id}`
    });
  }

  render() {
    return (
      <div className={`${this.props.classes} image-viewer__content image-viewer__content2`}>
        <div className="image-viewer__controls flex flex-end flex--v-center">
          <ButtonButton
            text='Zoom in'
            id={`zoom-in-${this.props.id}`}
            icon='zoomIn'
            extraClasses={`${buttonFontClasses} btn--round btn--black ${spacing({s: 1}, {margin: ['right']})}`}
            clickHandler={this.handleZoom}
          />

          <ButtonButton
            text='Zoom out'
            id={`zoom-out-${this.props.id}`}
            icon='zoomOut'
            extraClasses={`${buttonFontClasses} btn--round btn--black ${spacing({s: 8}, {margin: ['right']})}`}
            clickHandler={this.handleZoom}
          />

          <ButtonButton
            text='Close image viewer'
            icon='cross'
            extraClasses={`${buttonFontClasses} btn--round btn--black js-image-viewer__exit-button ${spacing({s: 2}, {margin: ['right']})}`}
            clickHandler={this.props.handleViewerDisplay}
          />
        </div>

        {this.props.viewerVisible && <ImageViewerImage id={this.props.id} contentUrl={this.props.contentUrl} />}
      </div>
    );
  }
}

type ImageViewerProps = {|
  id: string,
  trackTitle: string,
  contentUrl: string,
  width: number
|}

type ImageViewerState = {|
  showViewer: boolean,
  mountViewButton: boolean,
  viewButtonMounted: boolean
|}

class ImageViewer extends React.Component<ImageViewerProps, ImageViewerState> {
  handleViewerDisplay: Function;
  viewButtonMountedHandler: Function;

  constructor(props: ImageViewerProps) {
    super(props);
    this.state = {
      showViewer: false,
      mountViewButton: false,
      viewButtonMounted: false
    };
    this.handleViewerDisplay = this.handleViewerDisplay.bind(this);
    this.viewButtonMountedHandler = this.viewButtonMountedHandler.bind(this);
  }

  viewButtonMountedHandler() {
    this.setState(prevState => ({
      viewButtonMounted: !prevState.viewButtonMounted
    }));
  }

  handleViewerDisplay(e: Event) {
    ReactGA.event({
      category: 'component',
      action: `ImageViewer:${this.state.showViewer ? 'did close' : 'did open'}`,
      label: `id:${this.props.id},title:${this.props.trackTitle}`
    });

    this.setState(prevState => ({
      showViewer: !prevState.showViewer
    }));
  }

  componentDidMount() {
    this.setState(prevState => ({
      mountViewButton: true
    }));
  }

  render() {
    return (
      <Fragment>
        <Image
          width={this.props.width}
          contentUrl={this.props.contentUrl}
          lazyload={true}
          sizesQueries='(min-width: 860px) 800px, calc(92.59vw + 22px)'
          alt=''
          clickHandler={this.handleViewerDisplay}
          zoomable={this.state.viewButtonMounted} />
        <Transition in={this.state.mountViewButton} timeout={700}>
          {
            (status) => {
              if (status === 'exited') {
                return null;
              }
              return <LaunchViewerButton
                classes={`slideup-viewer-btn slideup-viewer-btn-${status}`}
                didMountHandler={this.viewButtonMountedHandler}
                clickHandler={this.handleViewerDisplay} />;
            }
          }
        </Transition>
        <Transition in={this.state.showViewer} timeout={{enter: 0, exit: 700}}>
          {
            (status) => {
              return <ViewerContent
                classes={`scale scale-${status}`}
                viewerVisible={this.state.showViewer}
                id={this.props.id}
                contentUrl={this.props.contentUrl}
                handleViewerDisplay={this.handleViewerDisplay} />;
            }
          }
        </Transition>
      </Fragment>
    );
  }
}

export default ImageViewer;
