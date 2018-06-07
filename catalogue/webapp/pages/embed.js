// @flow
import {Component} from 'react';
import ReactGA from 'react-ga';
import fetch from 'isomorphic-unfetch';
import {iiifImageTemplate} from '@weco/common/utils/convert-image-uri';
import ImageViewer2 from '@weco/common/views/components/ImageViewer/ImageViewer2';

// TODO: Find out where to get these types
class Embed extends Component<{| work: Object |}> {
  static getInitialProps = async({ query }: {| query: Object |}) => {
    const {id} = query;
    const res = await fetch(`https://api.wellcomecollection.org/catalogue/v1/works/${id}?includes=identifiers,items,thumbnail`);
    const json = await res.json();

    return {
      work: json
    };
  };
  componentDidMount () {
    if (!window.GA_INITIALIZED) {
      ReactGA.initialize('UA-55614-6', {
        gaOptions: {
          cookieDomain: 'auto'
        }
      });
      window.GA_INITIALIZED = true;
    }
    ReactGA.set({'dimension1': '2'});
    ReactGA.pageview(`${window.location.pathname}`);
  }

  render() {
    const {work} = this.props;
    const [iiifImageLocation] = work.items.map(
      item => item.locations.find(
        location => location.locationType === 'iiif-image'
      )
    );
    const iiifInfoUrl = iiifImageLocation && iiifImageLocation.url;
    const iiifImage = iiifImageTemplate(iiifInfoUrl);
    const imageUrl = iiifImage({width: 800});

    return (
      <div className='enhanced' style={{
        maxHeight: '95vh',
        maxWidth: '100vw',
        textAlign: 'center',
        position: 'relative'
      }}>
        <ImageViewer2
          contentUrl={imageUrl}
          id={work.id}
          width={800}
          trackTitle={work.title}
        />
      </div>
    );
  }
}

export default Embed;
