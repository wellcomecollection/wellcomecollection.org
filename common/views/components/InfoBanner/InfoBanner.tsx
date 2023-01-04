import React, { FunctionComponent, useEffect, useState } from 'react';
import cookies from '@weco/common/data/cookies';
import { getCookie, setCookie } from 'cookies-next';
import { grid, font } from '../../../utils/classnames';
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
})`
  background-color: ${props => props.theme.color('yellow')};
`;

const CloseButton = styled.button.attrs({
  className: 'plain-button',
})`
  margin: 0;
  padding: 0;
  cursor: pointer;
  color: ${props =>
    props.theme.color('black')}; // This avoids the default blue links on iOS
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
      <div className="container">
        <div className="grid">
          <div className={grid({ s: 12, m: 12, l: 12, xl: 12 })}>
            <div className={`flex flex--h-space-between ${font('intr', 5)}`}>
              <div>
                <span className="flex">
                  <Space
                    h={{ size: 'm', properties: ['margin-right'] }}
                    v={{ size: 'xs', properties: ['margin-top'] }}
                    className="flex"
                  >
                    <Icon icon={information} />
                    <span className="visually-hidden" id="note">
                      Notification
                    </span>
                  </Space>
                  <div className="body-text spaced-text">
                    <PrismicHtmlBlock html={text} />
                  </div>
                </span>
              </div>
              <Space v={{ size: 'xs', properties: ['margin-top'] }}>
                <CloseButton
                  onClick={hideInfoBanner}
                  aria-controls="notification"
                >
                  <Icon icon={cross} title="Close notification" />
                  <span className="visually-hidden">close notification</span>
                </CloseButton>
              </Space>
            </div>
          </div>
        </div>
      </div>
    </BannerContainer>
  ) : null;
};

export default InfoBanner;
