import styled from 'styled-components';

import { font } from '@weco/common/utils/classnames';
import Space from '@weco/common/views/components/styled/Space';

export const DialogControls = styled.span`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  flex-shrink: 0;
`;

export const NavGroup = styled.span`
  display: flex;
  align-items: center;
`;

export const DialogButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  border: 0;
  cursor: pointer;
  background: transparent;
  color: ${props => props.theme.color('white')};

  &:disabled {
    visibility: hidden;
  }
`;

export const TranscriptButton = styled.button.attrs({
  type: 'button',
  className: font('sans', -2),
})`
  display: flex;
  align-items: center;
  height: 36px;
  padding: 0 8px;
  border: 0;
  cursor: pointer;
  background: transparent;
  color: ${props => props.theme.color('white')};
  text-decoration: underline;
`;

export const VideoDialog = styled.dialog`
  padding: 0;
  border: 0;
  background: ${props => props.theme.color('black')};
  width: min(400px, calc(90dvh * 9 / 16), 90vw);
  display: flex;
  flex-direction: column;
  overflow: hidden;

  &:not([open]) {
    display: none;
  }

  &::backdrop {
    background: rgba(0, 0, 0, 0.85);
  }
`;

export const DialogVideoContainer = styled.div`
  flex-shrink: 0;
  position: relative;
  width: 100%;
  aspect-ratio: 9 / 16;
  overflow: hidden;
`;

export const VideoIframe = styled.iframe`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border: 0;
`;

export const TranscriptOverlay = styled(Space).attrs({
  $v: { size: 'sm', properties: ['padding-top', 'padding-bottom'] },
  $h: { size: 'sm', properties: ['padding-left', 'padding-right'] },
  className: font('sans', -1),
})<{ $hidden: boolean }>`
  position: absolute;
  inset: 0;
  z-index: 1;
  overflow-y: auto;
  overscroll-behavior: none;
  background: ${props => props.theme.color('black')};
  color: ${props => props.theme.color('white')};
  display: ${props => (props.$hidden ? 'none' : 'block')};
`;
