import { ChoiceBody, ContentResource } from '@iiif/presentation-3';
import { FunctionComponent, useEffect, useState } from 'react';
import styled from 'styled-components';

import { useAVTracking } from '@weco/content/hooks/useAVTracking';
import { CustomContentResource } from '@weco/content/types/manifest';

type Props = {
  video: (
    | (Omit<ContentResource, 'type'> & {
        type: ContentResource['type'] | 'Audio';
      })
    | CustomContentResource
    | ChoiceBody
  ) & {
    format?: string;
  };
  placeholderId: string | undefined;
  showDownloadOptions: boolean;
};

const StyledVideo = styled.video<{
  $posterFailed: boolean;
  $aspectRatio: string;
}>`
  aspect-ratio: ${props => props.$aspectRatio};
  ${props =>
    props.$posterFailed && `background: ${props.theme.color('neutral.700')};`}
`;

const VideoPlayer: FunctionComponent<Props> = ({
  video,
  placeholderId,
  showDownloadOptions,
}: Props) => {
  const { trackPlay, trackEnded, trackTimeUpdate } = useAVTracking('video');
  const width = 'width' in video ? video.width : undefined;
  const height = 'height' in video ? video.height : undefined;
  const aspectRatio = width && height ? `${width} / ${height}` : '16 / 9';

  const [posterFailed, setPosterFailed] = useState(!placeholderId);
  useEffect(() => {
    if (!placeholderId) {
      setPosterFailed(true);
      return;
    }
    const img = new Image();
    img.onload = () => setPosterFailed(false);
    img.onerror = () => setPosterFailed(true);
    img.src = placeholderId;
  }, [placeholderId]);

  return (
    <StyledVideo
      data-component="video-player"
      onPlay={event => {
        trackPlay(event);
      }}
      onEnded={trackEnded}
      onTimeUpdate={trackTimeUpdate}
      controlsList={!showDownloadOptions ? 'nodownload' : undefined}
      controls
      preload="none"
      poster={placeholderId}
      $posterFailed={posterFailed}
      $aspectRatio={aspectRatio}
    >
      <source src={video.id} type={video.format} />
      Sorry, your browser doesn&apos;t support embedded video.
    </StyledVideo>
  );
};

export default VideoPlayer;
