import { getCookie, setCookie } from 'cookies-next';
import { FunctionComponent, useEffect, useState } from 'react';

import cookies from '@weco/common/data/cookies';
import usePrevious from '@weco/common/hooks/usePrevious';
import { cross, exclamation } from '@weco/common/icons';
import Icon from '@weco/common/views/components/Icon';
import Space from '@weco/common/views/components/styled/Space';

import {
  BannerContainer,
  BannerWrapper,
  CloseButton,
  Copy,
  CopyContainer,
} from './InfoBanners.styles';

export type Props = {
  onVisibilityChange?: (isVisible: boolean) => void;
};

const WebsiteIssuesBanner: FunctionComponent<Props> = ({
  onVisibilityChange = () => {
    // noop
  },
}: Props) => {
  const defaultValue = false;
  const cookieName = cookies.siteIssueBanner;

  const [isVisible, setIsVisible] = useState<boolean>(defaultValue);
  const prevIsVisible = usePrevious(defaultValue);

  const hideInfoBanner = () => {
    const nowPlusFour = new Date();
    nowPlusFour.setTime(nowPlusFour.getTime() + 4 * 60 * 60 * 1000);

    setCookie(cookieName, 'true', {
      path: '/',
      expires: nowPlusFour,
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

  if (!isVisible) return null;

  return (
    <BannerContainer
      role="region"
      aria-labelledby="note"
      id="notification"
      $backgroundColor="accent.lightSalmon"
    >
      <BannerWrapper>
        <CopyContainer>
          <Space
            $h={{ size: 'm', properties: ['margin-right'] }}
            $v={{ size: 'xs', properties: ['margin-top'] }}
          >
            <Icon icon={exclamation} />
            <span className="visually-hidden" id="note">
              Notification
            </span>
          </Space>
          <Copy>
            We are experiencing some issues with the website, but we&apos;re
            working to fix them. Please try again later if you can&apos;t do
            something.
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
  );
};

export default WebsiteIssuesBanner;
