// @flow
import {Component} from 'react';
import ReactGA from 'react-ga';
import fetch from 'isomorphic-unfetch';
import WorkEmbed from '@weco/common/views/components/WorkEmbed/WorkEmbed';

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
    return (<WorkEmbed work={work} />);
  }
}

export default Embed;
