// @flow
/* global OpenSeadragon */
import React, {Fragment} from 'react';
import {Transition} from 'react-transition-group';
import {font, spacing} from '../../../utils/classnames';
import {convertImageUri, convertIiifUriToInfoUri} from '../../../utils/convert-image-uri';
import Image from '../Image/Image';
import ButtonButton from '../Buttons/ButtonButton/ButtonButton';
import Script from 'react-load-script';

const buttonFontClasses = font({s: 'HNM5'});

function setupViewer(imageInfoSrc, viewerId, handleScriptError) {
  window.fetch(convertIiifUriToInfoUri(convertImageUri(imageInfoSrc, 'full', false)))
    .then(response => response.json())
    .then((response) => {
      OpenSeadragon({
        id: `image-viewer-${viewerId}`,
        visibilityRatio: 1,
        showFullPageControl: false,
        showHomeControl: false,
        zoomInButton: `zoom-in-${viewerId}`,
        zoomOutButton: `zoom-out-${viewerId}`,
        showNavigator: true,
        controlsFadeDelay: 0,
        tileSources: [{
          '@context': 'http://iiif.io/api/image/2/context.json',
          '@id': response['@id'],
          'height': response.height,
          'width': response.width,
          'profile': [ 'http://iiif.io/api/image/2/level2.json' ],
          'protocol': 'http://iiif.io/api/image',
          'tiles': [{
            'scaleFactors': [ 1, 2, 4, 8, 16, 32 ],
            'width': 400
          }]
        }]
      });
    }).catch(err => { handleScriptError(err); });
}

const Error = () => (
  <div className={`image-viewer__error ${spacing({s: 5}, {padding: ['left', 'right', 'top', 'bottom']})}`}>
    <p>We were unable to load the image viewer.</p>
  </div>
);

type LaunchViewerProps = {|
  id: string,
  classes: string,
  clickHandler: Function,
  didMountHandler: Function
|}

class LaunchViewerButton extends React.Component<LaunchViewerProps> {
  componentDidMount() {
    this.props.didMountHandler();
  }

  render() {
    return (
      <ButtonButton
        text='View larger image'
        icon='zoomIn'
        extraClasses={`${this.props.classes} ${buttonFontClasses} btn--round image-viewer__launch-button js-image-viewer__launch-button`}
        onClick={this.props.clickHandler}
      />
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

type ViewerContentState = {|
  scriptLoaded: boolean,
  scriptError: boolean
|}

class ViewerContent extends React.Component<ViewerContentProps, ViewerContentState> {
  handleScriptError: Function;
  handleScriptLoaded: Function;
  escapeCloseViewer: Function;

  constructor(props) {
    super(props);
    this.state = {
      scriptLoaded: false,
      scriptError: false
    };
    this.handleScriptError = this.handleScriptError.bind(this);
    this.handleScriptLoaded = this.handleScriptLoaded.bind(this);
    this.escapeCloseViewer = this.escapeCloseViewer.bind(this);
  }

  handleScriptLoaded() {
    this.setState({ scriptLoaded: true });
    setupViewer(this.props.contentUrl, this.props.id, this.handleScriptError);
  }

  handleScriptError() {
    this.setState({ scriptError: true });
  }

  escapeCloseViewer({keyCode}) {
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

  render() {
    return (
      <div className={`${this.props.classes} image-viewer__content image-viewer__content2`}>
        <Script
          url='https://static.wellcomecollection.org/openseadragon/openseadragon.min.js'
          onError={this.handleScriptError}
          onLoad={this.handleScriptLoaded}
        />
        <div className="image-viewer__controls flex flex-end flex--v-center">
          <ButtonButton
            text='Zoom in'
            id={`zoom-in-${this.props.id}`}
            icon='zoomIn'
            extraClasses={`${buttonFontClasses} btn--round btn--black ${spacing({s: 1}, {margin: ['right']})}`}
          />

          <ButtonButton
            text='Zoom out'
            id={`zoom-out-${this.props.id}`}
            icon='zoomOut'
            extraClasses={`${buttonFontClasses} btn--round btn--black ${spacing({s: 8}, {margin: ['right']})}`}
          />

          <ButtonButton
            text='Close image viewer'
            icon='cross'
            extraClasses={`${buttonFontClasses} btn--round btn--black js-image-viewer__exit-button ${spacing({s: 2}, {margin: ['right']})}`}
            onClick={this.props.handleViewerDisplay}
          />
        </div>

        <div className='image-viewer__image' id={`image-viewer-${this.props.id}`}>
          {this.state.scriptError && <Error />}
        </div>
      </div>
    );
  }
}

type ImageViewerProps = {|
  id: string,
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
        <Transition in={this.state.mountViewButton} timeout={{enter: 0, exit: 700}}>
          {
            (status) => {
              if (status === 'exited') {
                return null;
              }
              return <LaunchViewerButton classes={`slideup-viewer-btn slideup-viewer-btn-${status}`} didMountHandler={this.viewButtonMountedHandler} clickHandler={this.handleViewerDisplay} id={this.props.id} />;
            }
          }
        </Transition>
        <Transition in={this.state.showViewer} timeout={{enter: 0, exit: 500}}>
          {
            (status) => {
              if (status === 'exited') {
                return null;
              }
              return <ViewerContent classes={`scale scale-${status}`} viewerVisible={this.state.showViewer} id={this.props.id} contentUrl={this.props.contentUrl} handleViewerDisplay={this.handleViewerDisplay}/>;
            }
          }
        </Transition>
      </Fragment>
    );
  }
}

export default ImageViewer;
