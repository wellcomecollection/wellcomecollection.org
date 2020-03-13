// @flow
import styled from 'styled-components';
import cookie from 'cookie-cutter';
import { font, classNames } from '@weco/common/utils/classnames';
import { useState, useEffect } from 'react';
import moment from 'moment';
import Icon from '@weco/common/views/components/Icon/Icon';
import Space from '@weco/common/views/components/styled/Space';
import Layout12 from '@weco/common/views/components/Layout12/Layout12';

const CookieNoticeStyle = styled.div.attrs({
  className: classNames({
    [font('hnm', 4)]: true,
  }),
})`
  position: fixed;
  background: ${props => props.theme.colors.teal};
  color: ${props => props.theme.colors.white};
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 1000;

  .icon {
    height: 1.3em;
  }

  .icon__shape {
    fill: ${props => props.theme.colors.white};
  }
}
`;
const CookieNotice = () => {
  const [shouldRender, setShouldRender] = useState(true);
  function hideCookieNotice() {
    cookie.set('WC_cookiesAccepted', 'true', {
      path: '/',
      expires: moment()
        .add(1, 'month')
        .toDate(),
    });

    setShouldRender(false);
  }

  useEffect(() => {
    setShouldRender(!cookie.get('WC_cookiesAccepted'));
  }, []);
  return (
    shouldRender && (
      <CookieNoticeStyle>
        <Layout12>
          <Space v={{ size: 'l', properties: ['margin-top', 'margin-bottom'] }}>
            <div className="flex flex--h-space-between">
              <div className="flex">
                <Space
                  as="span"
                  h={{ size: 's', properties: ['margin-right'] }}
                >
                  <Icon name="cookies" />
                </Space>
                <Space
                  as="span"
                  h={{ size: 's', properties: ['margin-right'] }}
                >
                  <h2 className="no-margin inline">Wellcome uses cookies.</h2>
                </Space>
                <a href="https://wellcome.ac.uk/about-us/terms-use#cookies">
                  Read our policy
                </a>
              </div>
              <button
                className="cookie-notification__close js-info-banner-close"
                onClick={hideCookieNotice}
              >
                <Icon name="clear" />
                <span className="visually-hidden">
                  Close cookie notification
                </span>
              </button>
            </div>
          </Space>
        </Layout12>
      </CookieNoticeStyle>
    )
  );
};

export default CookieNotice;
