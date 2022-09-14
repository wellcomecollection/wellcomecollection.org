import styled from 'styled-components';
import cookie from 'cookie-cutter';
import { font } from '@weco/common/utils/classnames';
import { useState, useEffect, FunctionComponent } from 'react';
import Icon from '@weco/common/views/components/Icon/Icon';
import Space from '@weco/common/views/components/styled/Space';
import Layout12 from '@weco/common/views/components/Layout12/Layout12';
import { clear, cookies } from '@weco/common/icons';
import { trackEvent } from '@weco/common/utils/ga';

const CookieNoticeStyle = styled.div.attrs({
  className: font('intb', 4),
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

type Props = {
  source: string;
};

const CookieNotice: FunctionComponent<Props> = ({ source }) => {
  const [shouldRender, setShouldRender] = useState(true);
  function hideCookieNotice() {
    // Remember that the user has accepted cookies for the next month.
    const expires = new Date();
    expires.setDate(new Date().getDate() + 30);

    cookie.set('WC_cookiesAccepted', 'true', { path: '/', expires });

    trackEvent({
      category: 'CookieNotice',
      action: 'click close cookie notice button',
      label: source,
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
              <Icon icon={cookies} />
              <Space
                as="span"
                h={{
                  size: 's',
                  properties: ['margin-left', 'margin-right'],
                }}
              >
                <h2 className="no-margin inline">Wellcome uses cookies.</h2>
              </Space>
              <a href="https://wellcome.org/who-we-are/privacy-and-terms#cookies">
                Read our policy
              </a>
            </div>
            <CloseCookieNotice onClick={hideCookieNotice}>
              <Icon icon={clear} />
              <span className="visually-hidden">Close cookie notification</span>
            </CloseCookieNotice>
          </div>
        </Space>
      </Layout12>
    </CookieNoticeStyle>
  ) : null;
};

export default CookieNotice;
