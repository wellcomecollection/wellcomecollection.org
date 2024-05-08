import styled from 'styled-components';
import cookies from '@weco/common/data/cookies';
import { hasCookie, setCookie } from 'cookies-next';
import { font } from '@weco/common/utils/classnames';
import { useState, useEffect, FunctionComponent } from 'react';
import Icon from '@weco/common/views/components/Icon/Icon';
import Space from '@weco/common/views/components/styled/Space';
import Layout, { gridSize12 } from '@weco/common/views/components/Layout';
import { clear, cookies as cookiesIcon } from '@weco/common/icons';
import { addDays, today } from '@weco/common/utils/dates';

const CookieNoticeStyle = styled.div.attrs({
  className: `${font('intb', 4)} is-hidden-print`,
})`
  position: fixed;
  background: ${props => props.theme.color('accent.blue')};
  color: ${props => props.theme.color('white')};
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 1000;
`;

const CloseCookieNotice = styled.button`
  display: flex;
  align-items: center;
  margin-left: 1em;
  background: none;
`;

const CookieMessage = styled.div`
  display: flex;
  align-items: center;
`;

const CookieNoticeWrapper = styled(Space).attrs({
  $v: { size: 'l', properties: ['margin-top', 'margin-bottom'] },
})`
  display: flex;
  justify-content: space-between;
`;

const Text = styled.h2`
  margin: 0;
  display: inline;
`;

const CookieMessageText = styled(Space).attrs({
  $h: {
    size: 's',
    properties: ['margin-left', 'margin-right'],
  },
})``;

type Props = {
  source: string;
};

const CookieNotice: FunctionComponent<Props> = () => {
  const [shouldRender, setShouldRender] = useState(true);
  function hideCookieNotice() {
    // Remember that the user has accepted cookies for the next month.
    setCookie(cookies.cookiesAccepted, 'true', {
      path: '/',
      expires: addDays(today(), 30),
      secure: true,
    });

    setShouldRender(false);
  }

  useEffect(() => {
    setShouldRender(!hasCookie(cookies.cookiesAccepted));
  }, []);

  return shouldRender ? (
    <CookieNoticeStyle>
      <Layout gridSizes={gridSize12()}>
        <CookieNoticeWrapper>
          <CookieMessage>
            <Icon icon={cookiesIcon} iconColor="white" />
            <CookieMessageText>
              <Text>Wellcome uses cookies.</Text>
            </CookieMessageText>
            <a href="https://wellcome.org/who-we-are/privacy-and-terms#cookies">
              Read our policy
            </a>
          </CookieMessage>
          <CloseCookieNotice onClick={hideCookieNotice}>
            <Icon icon={clear} iconColor="white" />
            <span className="visually-hidden">Close cookie notification</span>
          </CloseCookieNotice>
        </CookieNoticeWrapper>
      </Layout>
    </CookieNoticeStyle>
  ) : null;
};

export default CookieNotice;
