// @flow
import React from 'react';
import cookie from 'cookie-cutter';
import {spacing, grid, font} from '../../../utils/classnames';
import Icon from '../Icon/Icon';

type Props = {|
  cookieName?: string,
  text: string
|}

class InfoBanner extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
    this.state = {
      showInfoBanner: false
    };
    this.hideInfoBanner = this.hideInfoBanner.bind(this);
  }

  hideInfoBanner() {
    const singleSessionCookies = ['WC_globalAlert'];
    const isSingleSessionCookie = singleSessionCookies.indexOf(this.props.cookieName) > -1;
    cookie.set(this.props.cookieName, 'true', {
      path: '/',
      expires: isSingleSessionCookie ? null : 'Fri, 31 Dec 2036 23:59:59 GMT'
    });
    this.setState(prevState => ({
      showInfoBanner: false
    }));
  }

  componentDidMount() {
    const isAccepted = cookie.get(this.props.cookieName);
    if (isAccepted || (!window.location.search.match('wellcomeImagesUrl') && this.props.cookieName === 'WC_wellcomeImagesRedirect')) {
      return null;
    } else {
      this.setState(prevState => ({
        showInfoBanner: true
      }));
    }
  }

  render() {
    if (this.state.showInfoBanner) {
      return (
        <div
          className={`row bg-yellow ${spacing({s: 3}, {padding: ['top', 'bottom']})}`}>
          <div className='container'>
            <div className='grid'>
              <div className={grid({s: 12, m: 12, l: 12, xl: 12})}>
                <div className={`flex flex--v-center flex--h-space-between ${font({s: 'HNL5', m: 'HNL4'})}`}>
                  <div>
                    <span className='flex flex--v-center'>
                      <div className={`flex flex--v-center ${spacing({s: 2}, {margin: ['right']})}`}>
                        <Icon name='information' />
                      </div>
                      <div className='first-para-no-margin' dangerouslySetInnerHTML={{ __html: this.props.text }} />
                    </span>
                  </div>
                  <div>
                    <button className='no-margin no-padding plain-button pointer' onClick={this.hideInfoBanner}>
                      <Icon name='cross' title='Close notification' />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    } else {
      return null;
    }
  }
}

export default InfoBanner;
