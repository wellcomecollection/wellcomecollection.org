import { FunctionComponent } from 'react';
import styled from 'styled-components';

import { britishSignLanguageTranslation } from '@weco/common/icons';
import { font } from '@weco/common/utils/classnames';
import Icon from '@weco/common/views/components/Icon/Icon';
import {
  ContaineredLayout,
  gridSize8,
} from '@weco/common/views/components/Layout';
import Modal from '@weco/common/views/components/Modal/Modal';
import Space from '@weco/common/views/components/styled/Space';
import VideoEmbed, {
  Props as VideoEmbedProps,
} from '@weco/common/views/components/VideoEmbed/VideoEmbed';

const BslLeaftletButtonText = styled(Space).attrs({
  className: font('intr', 6),
  $h: { size: 's', properties: ['margin-left'] },
})``;

const BslLeafletButton = styled.button`
  display: flex;
  align-items: center;

  ${BslLeaftletButtonText} {
    text-decoration: underline;
  }
`;
// Add comment

const NewWindowVideo = styled.a`
  opacity: 0;
  position: absolute;
  bottom: 9px;
  left: 10px;
  padding: 5px;
  background: ${props => props.theme.color('neutral.700')};

  &:focus {
    opacity: 1;
  }
`;

type Props = {
  video: VideoEmbedProps & { title?: string };
  isModalActive: boolean;
  setIsModalActive: (value: boolean) => void;
};

const BslLeafletVideo: FunctionComponent<Props> = ({
  video,
  isModalActive,
  setIsModalActive,
}) => {
  return (
    <>
      <Modal
        id="bsl-leaflet-video-modal"
        isActive={isModalActive}
        setIsActive={setIsModalActive}
        width="80vw"
        maxWidth="1000px"
        modalStyle="video"
      >
        <Space
          $h={{ size: 'm', properties: ['padding-left'] }}
          $v={{ size: 'm', properties: ['padding-top', 'padding-bottom'] }}
        >
          <Space $h={{ size: 'xl', properties: ['padding-right'] }}>
            <h3 className={font('intsb', 5)} style={{ marginBottom: 0 }}>
              {video.title}
            </h3>
          </Space>
        </Space>
        {isModalActive ? (
          <>
            <VideoEmbed
              embedUrl={video.embedUrl}
              videoProvider={video.videoProvider}
              videoThumbnail={video.videoThumbnail}
              hasFullSizePoster={true}
            />
            <NewWindowVideo href={video.embedUrl}>
              Open video in a new window
            </NewWindowVideo>
          </>
        ) : null}
      </Modal>
      <Space $v={{ size: 'l', properties: ['margin-top'] }}>
        <Space
          $v={{ negative: true, size: 'm', properties: ['margin-bottom'] }}
        >
          <ContaineredLayout gridSizes={gridSize8()}>
            <BslLeafletButton
              aria-controls="bsl-leaflet-video-modal"
              onClick={() => setIsModalActive(true)}
            >
              <Icon
                icon={britishSignLanguageTranslation}
                sizeOverride="width: 32px; height: 32px;"
              />{' '}
              <BslLeaftletButtonText>
                Watch in sign language
              </BslLeaftletButtonText>
            </BslLeafletButton>
          </ContaineredLayout>
        </Space>
      </Space>
    </>
  );
};

export default BslLeafletVideo;
