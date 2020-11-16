import React, { FunctionComponent, useEffect, useState } from 'react';
import { HTMLString } from '../../../../common/services/prismic/types';
import cookie from 'cookie-cutter';
import { grid, font } from '../../../utils/classnames';
import Icon from '../Icon/Icon';
import PrismicHtmlBlock from '../PrismicHtmlBlock/PrismicHtmlBlock';
import Space from '../styled/Space';

type Props = {
  cookieName?: string;
  text: HTMLString;
  initialIsVisible?: boolean;
};

const InfoBanner: FunctionComponent<Props> = ({ cookieName, text }: Props) => {
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const hideInfoBanner = () => {
    const singleSessionCookies = ['WC_globalAlert'];
    const isSingleSessionCookie =
      cookieName && singleSessionCookies.indexOf(cookieName) > -1;

    cookie.set(cookieName, 'true', {
      path: '/',
      expires: isSingleSessionCookie ? null : 'Fri, 31 Dec 2036 23:59:59 GMT',
    });

    setIsVisible(false);
  };

  useEffect(() => {
    const isAccepted = cookie.get(cookieName);

    if (!isAccepted) {
      setIsVisible(true);
    }
  }, []);

  return isVisible ? (
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
                    <PrismicHtmlBlock html={text} />
                  </div>
                </span>
              </div>
              <Space v={{ size: 'xs', properties: ['margin-top'] }}>
                <button
                  className="no-margin no-padding plain-button pointer"
                  onClick={hideInfoBanner}
                >
                  <Icon name="cross" title="Close notification" />
                  <span className="visually-hidden">close notification</span>
                </button>
              </Space>
            </div>
          </div>
        </div>
      </div>
    </Space>
  ) : null;
};

export default InfoBanner;
