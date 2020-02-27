// @flow
import React from 'react';
import type { HTMLString } from '../../../../common/services/prismic/types';
import cookie from 'cookie-cutter';
import { grid, font } from '../../../utils/classnames';
import Icon from '../Icon/Icon';
import PrismicHtmlBlock from '../PrismicHtmlBlock/PrismicHtmlBlock';
import Space from '../styled/Space';

type Props = {|
  cookieName?: string,
  text: HTMLString,
|};

type State = {|
  showInfoBanner: boolean,
|};

class InfoBanner extends React.Component<Props, State> {
  state = {
    showInfoBanner: false,
  };

  hideInfoBanner = () => {
    const singleSessionCookies = ['WC_globalAlert'];
    const isSingleSessionCookie =
      singleSessionCookies.indexOf(this.props.cookieName) > -1;
    cookie.set(this.props.cookieName, 'true', {
      path: '/',
      expires: isSingleSessionCookie ? null : 'Fri, 31 Dec 2036 23:59:59 GMT',
    });
    this.setState(prevState => ({
      showInfoBanner: false,
    }));
  };

  componentDidMount() {
    const isAccepted = cookie.get(this.props.cookieName);

    if (
      isAccepted ||
      (!window.location.search.match('wellcomeImagesUrl') &&
        this.props.cookieName === 'WC_wellcomeImagesRedirect')
    ) {
      return null;
    } else {
      this.setState(prevState => ({
        showInfoBanner: true,
      }));
    }
  }

  render() {
    if (this.state.showInfoBanner) {
      return (
        <Space
          v={{
            size: 'm',
            properties: ['padding-top', 'padding-bottom'],
          }}
          className={`row bg-yellow`}
        >
          <div className="container">
            <div className="grid">
              <div className={grid({ s: 12, m: 12, l: 12, xl: 12 })}>
                <div className={`flex flex--h-space-between ${font('hnl', 5)}`}>
                  <div>
                    <span className="flex">
                      <Space
                        h={{ size: 'm', properties: ['margin-right'] }}
                        v={{ size: 'xs', properties: ['margin-top'] }}
                        className={`flex`}
                      >
                        <Icon name="information" />
                      </Space>
                      <div className="body-text spaced-text">
                        <PrismicHtmlBlock html={this.props.text} />
                      </div>
                    </span>
                  </div>
                  <Space v={{ size: 'xs', properties: ['margin-top'] }}>
                    <button
                      className="no-margin no-padding plain-button pointer"
                      onClick={this.hideInfoBanner}
                    >
                      <Icon name="cross" title="Close notification" />
                      <span className="visually-hidden">
                        close notification
                      </span>
                    </button>
                  </Space>
                </div>
              </div>
            </div>
          </div>
        </Space>
      );
    } else {
      return null;
    }
  }
}

export default InfoBanner;
