// @flow
import {Fragment, Component} from 'react';
import ReactGA from 'react-ga';
import fetch from 'isomorphic-unfetch';
import {iiifImageTemplate} from '@weco/common/utils/convert-image-uri';
import ImageViewer2 from '@weco/common/views/components/ImageViewer/ImageViewer2';
import Image from '@weco/common/views/components/Image/Image';

// TODO: Find out where to get these types
class Embed extends Component<{| work: Object, withViewer: boolean |}> {
  static getInitialProps = async({ query, req }: {| query: Object |}) => {
    const {id, withViewer} = query;
    const res = await fetch(`https://api.wellcomecollection.org/catalogue/v1/works/${id}?includes=identifiers,items,thumbnail`);
    const json = await res.json();

    return {
      withViewer,
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
    const {work, withViewer} = this.props;
    const [iiifImageLocation] = work.items.map(
      item => item.locations.find(
        location => location.locationType === 'iiif-image'
      )
    );
    const iiifInfoUrl = iiifImageLocation && iiifImageLocation.url;
    const iiifImage = iiifImageTemplate(iiifInfoUrl);
    const imageUrl = iiifImage({width: 800});

    return (
      <Fragment>
        <div className='enhanced' style={{
          maxHeight: '95vh',
          maxWidth: '100vw',
          textAlign: 'center',
          position: 'relative'
        }}>
          <Fragment>
            {withViewer && <ImageViewer2
              contentUrl={imageUrl}
              id={work.id}
              width={800}
              trackTitle={work.title}
            />}

            {!withViewer && <Image
              extraClasses='margin-v-auto width-auto inherit-max-height'
              width={800}
              defaultSize={800}
              contentUrl={imageUrl}
              lazyload={false}
              sizesQueries='(min-width: 860px) 800px, calc(92.59vw + 22px)'
              alt='' />}
          </Fragment>
        </div>
      </Fragment>
    );
  }
}

export default Embed;
