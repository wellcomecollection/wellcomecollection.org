// TODO: flow!
import {Component} from 'react';
import Raven from 'raven-js';

function withSentry(Child) {
  return class WrappedComponent extends Component {
    static getInitialProps(context) {
      if (Child.getInitialProps) {
        return Child.getInitialProps(context);
      }

      return {};
    }
    constructor (props) {
      super(props);

      this.state = {
        error: null
      };

      Raven.config('https://f756b8d4b492473782987a054aa9a347@sentry.io/133634', {
        shouldSendCallback(data) {
          if (window) {
            const oldSafari = /^.*Version\/[0-8].*Safari.*$/;
            const bingPreview = /^.*BingPreview.*$/;

            return ![oldSafari, bingPreview].some(r => r.test(window.navigator.userAgent));
          } else {
            return true;
          }
        },
        whitelistUrls: [/wellcomecollection\.org/],
        ignoreErrors: [
          /Blocked a frame with origin/,
          /document\.getElementsByClassName\.ToString/ // https://github.com/SamsungInternet/support/issues/56
        ]
      }).install();
    }

    componentDidCatch(error, errorInfo) {
      this.setState({ error });
      Raven.captureException(error, { extra: errorInfo });
    }

    render() {
      return <Child {...this.props} error={this.state.error} />;
    }
  };
}

export default withSentry;
