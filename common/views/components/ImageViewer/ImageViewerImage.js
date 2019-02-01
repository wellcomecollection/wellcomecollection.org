// @flow
import {Component} from 'react';
import {spacing} from '../../../utils/classnames';
import openseadragon from 'openseadragon';

function setupViewer(imageInfoSrc, viewerId, handleScriptError) {
  window.fetch(imageInfoSrc)
    .then(response => response.json())
    .then((response) => {
      openseadragon({
        id: `image-viewer-${viewerId}`,
        visibilityRatio: 1,
        showFullPageControl: false,
        showHomeControl: false,
        zoomInButton: `zoom-in-${viewerId}`,
        zoomOutButton: `zoom-out-${viewerId}`,
        showNavigator: true,
        controlsFadeDelay: 0,
        animationTime: 0.5,
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
    }).catch(_ => { handleScriptError(); });
}

const ErrorMessage = () => (
  <div className={`image-viewer__error ${spacing({s: 5}, {padding: ['left', 'right', 'top', 'bottom']})}`}>
    <p>The image viewer is not working.</p>
  </div>
);

type Props = {|
  id: string,
  infoUrl: string
|}

type State = {|
  scriptError: boolean
|}

class ImageViewerImage extends Component<Props, State> {
  state = {
    scriptError: false
  }

  handleScriptError = () => {
    this.setState({ scriptError: true });
  }

  componentDidMount() {
    setupViewer(this.props.infoUrl, this.props.id, this.handleScriptError);
  }

  render() {
    return (
      <div className='image-viewer__image' id={`image-viewer-${this.props.id}`}>
        {this.state.scriptError && <ErrorMessage />}
      </div>
    );
  }
}

export default ImageViewerImage;
