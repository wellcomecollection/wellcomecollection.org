// @flow
import React from 'react';
import {convertImageUri, convertIiifUriToInfoUri} from '../../../utils/convert-image-uri';
import {spacing} from '../../../utils/classnames';
import openseadragon from 'openseadragon';

function setupViewer(imageInfoSrc, viewerId, handleScriptError) {
  window.fetch(convertIiifUriToInfoUri(convertImageUri(imageInfoSrc, 'full', false)))
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

const ErrorMessage = () => (
  <div className={`image-viewer__error ${spacing({s: 5}, {padding: ['left', 'right', 'top', 'bottom']})}`}>
    <p>The image viewer is not working.</p>
  </div>
);

type Props = {|
  id: string,
  contentUrl: string
|}

type State = {|
  scriptError: boolean
|}

class ImageViewerImage extends React.Component<Props, State> {
  handleScriptError: Function;

  constructor(props: Props) {
    super(props);
    this.state = {
      scriptError: false
    };

    this.handleScriptError = this.handleScriptError.bind(this);
  }

  handleScriptError() {
    this.setState({ scriptError: true });
  }

  componentDidMount() {
    setupViewer(this.props.contentUrl, this.props.id, this.handleScriptError);
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
