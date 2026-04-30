import styled from 'styled-components';

import Space from '@weco/common/views/components/styled/Space';

export const VideoDialog = styled.dialog`
  padding: 0;
  border: 0;
  background: ${props => props.theme.color('black')};
  width: min(400px, calc(90dvh * 9 / 16), 90vw);
  aspect-ratio: 9 / 16;
  overflow: hidden;

  &::backdrop {
    background: rgba(0, 0, 0, 0.85);
  }
`;

export const DialogVideoContainer = styled.div`
  position: absolute;
  inset: 0;
`;

export const VideoIframe = styled.iframe`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border: 0;
`;

export const TranscriptPanel = styled(Space).attrs({
  $v: { size: 'xs', properties: ['padding-top', 'padding-bottom'] },
  $h: { size: 'xs', properties: ['padding-left', 'padding-right'] },
})`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 1;
  max-height: 85%;
  overflow-y: auto;
  overscroll-behavior: contain;
  background: ${props => props.theme.color('white')};
`;
