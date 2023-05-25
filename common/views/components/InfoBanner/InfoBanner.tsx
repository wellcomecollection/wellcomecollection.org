import React, { FunctionComponent, useEffect, useState } from 'react';
import cookies from '@weco/common/data/cookies';
import { getCookie, setCookie } from 'cookies-next';
import { font } from '../../../utils/classnames';
import Icon from '../Icon/Icon';
import PrismicHtmlBlock from '../PrismicHtmlBlock/PrismicHtmlBlock';
import Space from '../styled/Space';
import usePrevious from '../../../hooks/usePrevious';
import { cross, information } from '../../../icons';
import { GlobalAlertPrismicDocument } from '../../../services/prismic/documents';
import { InferDataInterface } from '../../../services/prismic/types';
import styled from 'styled-components';

type Props = {
  cookieName: string;
  document: { data: InferDataInterface<GlobalAlertPrismicDocument> };
  onVisibilityChange?: (isVisible: boolean) => void;
};

const BannerContainer = styled(Space).attrs({
  v: { size: 'm', properties: ['padding-top', 'padding-bottom'] },
  className: font('intr', 5),
})`
  background-color: ${props => props.theme.color('yellow')};
`;

const BannerWrapper = styled.div.attrs({
  className: 'container',
})`
  display: flex;
  justify-content: space-between;
`;

const CopyContainer = styled.div`
  display: flex;
`;

const Copy = styled(Space).attrs({
  h: { size: 'm', properties: ['margin-right'] },
  className: 'body-text spaced-text',
})`
  align-self: center;
`;

const CloseButton = styled.button`
  margin: 0;
  padding: 0;
  color: ${props =>
    props.theme.color('black')}; /* This avoids the default blue links on iOS */
`;

const InfoBanner: FunctionComponent<Props> = ({
  cookieName,
  document,
  onVisibilityChange = () => {
    // noop
  },
}: Props) => {
  const { text } = document.data;
  const defaultValue = false;
  const [isVisible, setIsVisible] = useState<boolean>(defaultValue);
  const prevIsVisible = usePrevious(defaultValue);
  const hideInfoBanner = () => {
    const singleSessionCookies = [cookies.globalAlert];
    const isSingleSessionCookie =
      cookieName && singleSessionCookies.indexOf(cookieName) > -1;

    setCookie(cookieName, 'true', {
      path: '/',
      expires: isSingleSessionCookie
        ? undefined
        : new Date('2036-12-31T23:59:59Z'),
    });

    setIsVisible(false);
    onVisibilityChange(false);
  };

  useEffect(() => {
    if (prevIsVisible !== isVisible) {
      onVisibilityChange(isVisible);
    }
  }, [isVisible]);

  useEffect(() => {
    const isAccepted = getCookie(cookieName);

    if (!isAccepted) {
      setIsVisible(true);
    }
  }, []);

  return isVisible ? (
    <BannerContainer role="region" aria-labelledby="note" id="notification">
      <BannerWrapper>
        <CopyContainer>
          <Space
            h={{ size: 'm', properties: ['margin-right'] }}
            v={{ size: 'xs', properties: ['margin-top'] }}
          >
            <Icon icon={information} />
            <span className="visually-hidden" id="note">
              Notification
            </span>
          </Space>
          <Copy>
            <PrismicHtmlBlock html={text} />
          </Copy>
        </CopyContainer>
        <Space v={{ size: 'xs', properties: ['margin-top'] }}>
          <CloseButton onClick={hideInfoBanner} aria-controls="notification">
            <Icon icon={cross} title="Close notification" />
            <span className="visually-hidden">close notification</span>
          </CloseButton>
        </Space>
      </BannerWrapper>
    </BannerContainer>
  ) : null;
};

export default InfoBanner;
