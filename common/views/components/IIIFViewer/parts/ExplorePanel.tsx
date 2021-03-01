import styled from 'styled-components';
import { useContext, RefObject, FunctionComponent, ReactNode } from 'react';
import {
  headerHeight,
  topBarHeight,
} from '@weco/common/views/components/IIIFViewer/IIIFViewer';
import GlobalInfoBarContext from '@weco/common/views/components/GlobalInfoBarContext/GlobalInfoBarContext';

type ExploreContainerProps = {
  isVisible?: boolean;
  isFullscreen?: boolean;
  infoBarIsVisible?: boolean;
  viewerRef: RefObject<HTMLElement>;
};

const ExploreContainer = styled.div<ExploreContainerProps>`
  outline: none;
  position: fixed;
  top: ${props => {
    const viewerOffset = props?.viewerRef?.current?.offsetTop || 0;

    if (props.isVisible && props.isFullscreen) {
      return `${topBarHeight}px`;
    } else if (props.isVisible && !props.isFullscreen) {
      if (props.infoBarIsVisible) {
        return `${viewerOffset + topBarHeight}px`;
      } else {
        return `${headerHeight}px`;
      }
    } else {
      return `100vh`;
    }
  }};
  left: 0;
  bottom: 0;
  width: 100vw;
  z-index: 1;
  background: ${props => props.theme.color('viewerBlack')};
  transition: top 500ms ease;
`;

type Props = {
  explorePanelVisible: boolean;
  isFullscreen: boolean;
  viewerRef: RefObject<HTMLElement>;
  children: ReactNode;
};

const ExplorePanel: FunctionComponent<Props> = ({
  explorePanelVisible,
  isFullscreen,
  viewerRef,
  children,
}: Props) => {
  const { isVisible } = useContext(GlobalInfoBarContext);
  return (
    <ExploreContainer
      isVisible={explorePanelVisible}
      isFullscreen={isFullscreen}
      infoBarIsVisible={isVisible}
      viewerRef={viewerRef}
    >
      {children}
    </ExploreContainer>
  );
};

export default ExplorePanel;
