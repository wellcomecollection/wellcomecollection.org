import styled from 'styled-components';
import cookie from 'cookie-cutter';
import { font, classNames } from '@weco/common/utils/classnames';
import { useState, useEffect, FunctionComponent } from 'react';
import moment from 'moment';
import Icon from '@weco/common/views/components/Icon/Icon';
import Space from '@weco/common/views/components/styled/Space';
import Layout12 from '@weco/common/views/components/Layout12/Layout12';

const CookieNoticeStyle = styled.div.attrs({
  className: classNames({
    [font('hnb', 4)]: true,
  }),
})`
  position: fixed;
  background: ${props => props.theme.color('teal')};
  color: ${props => props.theme.color('white')};
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 1000;

  .icon__shape {
    fill: ${props => props.theme.color('white')};
  }
`;

const CloseCookieNotice = styled.button`
  display: flex;
  align-items: center;
  margin-left: 1em;
  cursor: pointer;
  appearance: none;
  background: none;
  border: 0;
`;

const CookieNotice: FunctionComponent = () => {
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

  return shouldRender ? (
    <CookieNoticeStyle data-test-id="cookie-notice">
      <Layout12>
        <Space v={{ size: 'l', properties: ['margin-top', 'margin-bottom'] }}>
          <div className="flex flex--h-space-between">
            <div className="flex flex--v-center">
              <Icon name="cookies" />
              <Space
                as="span"
                h={{
                  size: 's',
                  properties: ['margin-left', 'margin-right'],
                }}
              >
                <h2 className="no-margin inline">Wellcome uses cookies.</h2>
              </Space>
              <a href="https://wellcome.ac.uk/about-us/terms-use#cookies">
                Read our policy
              </a>
            </div>
            <CloseCookieNotice onClick={hideCookieNotice}>
              <Icon name="clear" />
              <span className="visually-hidden">Close cookie notification</span>
            </CloseCookieNotice>
          </div>
        </Space>
      </Layout12>
    </CookieNoticeStyle>
  ) : null;
};

export default CookieNotice;
