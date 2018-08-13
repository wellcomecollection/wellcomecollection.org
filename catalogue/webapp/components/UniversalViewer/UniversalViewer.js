// @flow
/* global UV, createUV */
import {Component} from 'react';

type Props = {|
  manifestUrl: string
|}

class UniversalViewer extends Component<Props> {
  componentDidMount() {
    const scriptLoadedPromises = ['helpers', 'offline'].map(scriptName => {
      const script = document.createElement('script');
      script.src = `/static/libs/uv/${scriptName}.js`;
      document.head && document.head.appendChild(script);

      return new Promise((resolve, reject) => {
        script.addEventListener('load', resolve);
      });
    });

    Promise.all(scriptLoadedPromises).then(() => {
      const script = document.createElement('script');
      script.src = `/static/libs/uv/uv.js`;
      document.head && document.head.appendChild(script);
      script.addEventListener('load', () => {
        window.addEventListener('uvLoaded', () => {
          // $FlowFixMe
          createUV('#uv', {
            iiifResourceUri: this.props.manifestUrl,
            configUri: 'uv-config.json'
            // $FlowFixMe
          }, new UV.URLDataProvider());
        }, false);
      });
    });
  }
  render() {
    return (
      <div>
        <div id='uv' className='uv' style={{
          width: '800px',
          height: '600px',
          background: '#345'
        }}></div>
      </div>
    );
  }
}
export default UniversalViewer;
