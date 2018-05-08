// @flow
import React, {Fragment} from 'react';
import {Transition} from 'react-transition-group';
import Image from '../Image/Image';
import Control from '../Buttons/Control/Control';
import {spacing} from '../../../utils/classnames';
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
      <Control
        type='dark'
        text='View larger image'
        icon='zoomIn'
        extraClasses={`image-viewer__launch-button ${this.props.classes}`}
        clickHandler={this.props.clickHandler} />
    );
  }
};

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

  handleZoomIn = (event) => {
    ReactGA.event({
      category: 'component',
      action: 'ZoomImageViewer:did zoom in',
      label: `id:${this.props.id}`
    });
  }

  handleZoomOut = (event) => {
    ReactGA.event({
      category: 'component',
      action: 'ZoomImageViewer:did zoom out',
      label: `id:${this.props.id}`
    });
  }

  render() {
    return (
      <div className={`${this.props.classes} image-viewer__content image-viewer__content2`}>
        <div className='image-viewer__controls flex flex-end flex--v-center'>
          <Control
            type='light'
            text='Zoom in'
            id={`zoom-in-${this.props.id}`}
            icon='zoomIn'
            extraClasses={`${spacing({s: 1}, {margin: ['right']})}`}
            clickHandler={this.handleZoomIn} />

          <Control
            type='light'
            text='Zoom out'
            id={`zoom-out-${this.props.id}`}
            icon='zoomOut'
            extraClasses={`{spacing({s: 8}, {margin: ['right']})}`}
            clickHandler={this.handleZoomOut} />

          <Control
            type='light'
            text='Close image viewer'
            icon='cross'
            extraClasses={`${spacing({s: 2}, {margin: ['right']})}`}
            clickHandler={this.props.handleViewerDisplay} />
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
