import { getCookie, setCookie } from 'cookies-next';
import { FunctionComponent, useEffect, useState } from 'react';

import cookies from '@weco/common/data/cookies';
import usePrevious from '@weco/common/hooks/usePrevious';
import { cross, information } from '@weco/common/icons';
import { GlobalAlertDocument as RawGlobalAlertDocument } from '@weco/common/prismicio-types';
import { InferDataInterface } from '@weco/common/services/prismic/types';
import Icon from '@weco/common/views/components/Icon';
import PrismicHtmlBlock from '@weco/common/views/components/PrismicHtmlBlock';
import Space from '@weco/common/views/components/styled/Space';

import {
  BannerContainer,
  BannerWrapper,
  CloseButton,
  Copy,
  CopyContainer,
} from './InfoBanners.styles';

type Props = {
  cookieName: string;
  document: { data: InferDataInterface<RawGlobalAlertDocument> };
  onVisibilityChange?: (isVisible: boolean) => void;
};

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
      secure: true,
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
            $h={{ size: 'm', properties: ['margin-right'] }}
            $v={{ size: 'xs', properties: ['margin-top'] }}
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
        <Space $v={{ size: 'xs', properties: ['margin-top'] }}>
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
