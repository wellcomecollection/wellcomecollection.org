import { exclamation, mute } from '@weco/common/icons';
import Icon from '@weco/common/views/components/Icon';
import Space from '@weco/common/views/components/styled/Space';

import {
  BannerContainer,
  BannerWrapper,
  Copy,
  CopyContainer,
} from './InfoBanners.styles';

const TendernessAndRageKioskBanners = () => (
  <div data-component="kiosk-tr-banners">
    <BannerContainer
      $backgroundColor="warmNeutral.300"
      role="region"
      aria-label="audio-note"
      id="audio-notification"
    >
      <BannerWrapper>
        <CopyContainer>
          <Space
            $h={{ size: 'sm', properties: ['margin-right'] }}
            $v={{ size: '2xs', properties: ['margin-top'] }}
          >
            <Icon icon={mute} />
            <span className="visually-hidden" id="audio-note">
              Sound notification
            </span>
          </Space>
          <Copy>Sound will not play on this device.</Copy>
        </CopyContainer>
      </BannerWrapper>
    </BannerContainer>
    <BannerContainer
      role="region"
      aria-labelledby="content-note"
      id="content-notification"
    >
      <BannerWrapper>
        <CopyContainer>
          <Space
            $h={{ size: 'sm', properties: ['margin-right'] }}
            $v={{ size: '2xs', properties: ['margin-top'] }}
          >
            <Icon icon={exclamation} />
            <span className="visually-hidden" id="content-note">
              Content notification
            </span>
          </Space>
          <Copy>
            <strong>Content note:</strong> This material includes lived
            experiences and historical perspectives on HIV and AIDS. Some works
            reference illness, death, bereavement, stigma, racism, homophobia
            and discrimination. Language may be dated or discriminatory, and
            some imagery is explicit. For more information, please speak to a
            member of staff.
          </Copy>
        </CopyContainer>
      </BannerWrapper>
    </BannerContainer>
  </div>
);

export default TendernessAndRageKioskBanners;
