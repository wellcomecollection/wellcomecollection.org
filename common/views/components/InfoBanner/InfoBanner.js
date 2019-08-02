// @flow
import React from 'react';
import type { HTMLString } from '../../../../common/services/prismic/types';
import cookie from 'cookie-cutter';
import { grid, font } from '../../../utils/classnames';
import Icon from '../Icon/Icon';
import PrismicHtmlBlock from '../PrismicHtmlBlock/PrismicHtmlBlock';
import VerticalSpace from '../styled/VerticalSpace';

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
        <VerticalSpace
          v={{
            size: 'm',
            properties: ['padding-top', 'padding-bottom'],
          }}
          className={`row bg-yellow`}
        >
          <div className="container">
            <div className="grid">
              <div className={grid({ s: 12, m: 12, l: 12, xl: 12 })}>
                <div
                  className={`flex flex--v-center flex--h-space-between ${font(
                    'hnl',
                    5
                  )}`}
                >
                  <div>
                    <span className="flex flex--v-center">
                      <div className={`flex flex--v-center margin-right-12`}>
                        <Icon name="information" />
                      </div>
                      <div className="first-para-no-margin">
                        <PrismicHtmlBlock html={this.props.text} />
                      </div>
                    </span>
                  </div>
                  <div>
                    <button
                      className="no-margin no-padding plain-button pointer"
                      onClick={this.hideInfoBanner}
                    >
                      <Icon name="cross" title="Close notification" />
                      <span className="visually-hidden">
                        close notification
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </VerticalSpace>
      );
    } else {
      return null;
    }
  }
}

export default InfoBanner;
