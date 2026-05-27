import NextLink from 'next/link';
import { FunctionComponent } from 'react';
import styled from 'styled-components';

import { useAppContext } from '@weco/common/contexts/AppContext';
import { chevron, gridView, maximise, singlePage } from '@weco/common/icons';
import { font } from '@weco/common/utils/classnames';
import Icon from '@weco/common/views/components/Icon';
import Space from '@weco/common/views/components/styled/Space';
import { useItemViewerContext } from '@weco/content/contexts/ItemViewerContext';
import useIsFullscreenEnabled from '@weco/content/hooks/useIsFullscreenEnabled';
import { toWorksItemLink } from '@weco/content/views/components/ItemLink';

import ToolbarSegmentedControl from './ToolbarSegmentedControl';
import { ViewerButton } from './ViewerTopBar';

const BottomBar = styled.div`
  position: relative;
  z-index: 3;
  background: ${props => props.theme.color('neutral.700')};
  color: ${props => props.theme.color('white')};
  display: flex;
  justify-content: space-between;
`;

const LeftZone = styled(Space).attrs({
  $v: { size: 'xs', properties: ['padding-top', 'padding-bottom'] },
  $h: { size: 'sm', properties: ['padding-left'] },
})`
  display: flex;
  justify-content: flex-start;
  align-items: center;
`;

const RightZone = styled(Space).attrs({
  $v: { size: 'xs', properties: ['padding-top', 'padding-bottom'] },
})`
  display: flex;
  justify-content: flex-end;
  align-items: center;
`;

const NavigationBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: ${props => props.theme.spacingUnit * 2}px;
`;

const NavButton = styled.a<{ $disabled?: boolean }>`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacingUnit}px;
  padding: ${props => props.theme.spacingUnit}px
    ${props => props.theme.spacingUnit * 2}px;
  color: ${props => props.theme.color('white')};
  background: ${props => props.theme.color('neutral.600')};
  border-radius: ${props => props.theme.borderRadiusUnit}px;
  text-decoration: none;
  transition: background ${props => props.theme.transitionProperties};

  ${props =>
    props.$disabled
      ? `
    opacity: 0.5;
    cursor: not-allowed;
  `
      : `
    &:hover {
      background: ${props.theme.color('neutral.500')};
    }
  `}
`;

const ViewerBottomBar: FunctionComponent = () => {
  const { isEnhanced } = useAppContext();
  const isFullscreenEnabled = useIsFullscreenEnabled();
  const {
    transformedManifest,
    gridVisible,
    setGridVisible,
    showZoomed,
    isMobileSidebarActive,
    showFullscreenControl,
    viewerRef,
    work,
    query,
    canvasIndexById,
    hasOnlyRenderableImages,
  } = useItemViewerContext();

  const { canvases } = { ...transformedManifest };
  const { canvas } = query;

  // Navigation logic for previous/next canvas
  const hasCompleteStructure =
    Object.keys(canvasIndexById).length === canvases?.length;
  const totalCanvases = hasCompleteStructure
    ? Object.keys(canvasIndexById).length
    : canvases?.length || 0;
  const hasPreviousCanvas = canvas > 1;
  const hasNextCanvas = canvas < totalCanvases;
  const previousCanvasLink = hasPreviousCanvas
    ? toWorksItemLink({ workId: work.id, props: { canvas: canvas - 1 } })
    : null;
  const nextCanvasLink = hasNextCanvas
    ? toWorksItemLink({ workId: work.id, props: { canvas: canvas + 1 } })
    : null;
  const hasMultipleCanvases = (canvases?.length || 0) > 1;

  return (
    <BottomBar data-testid="bottombar">
      {!hasOnlyRenderableImages && hasMultipleCanvases ? (
        <NavigationBar>
          {previousCanvasLink ? (
            <NextLink {...previousCanvasLink} passHref legacyBehavior>
              <NavButton className={font('sans', -1)}>
                <Icon icon={chevron} rotate={90} />
                Previous
              </NavButton>
            </NextLink>
          ) : (
            <NavButton $disabled className={font('sans', -1)}>
              <Icon icon={chevron} rotate={90} />
              Previous
            </NavButton>
          )}
          <span className={font('sans', -1)} style={{ color: 'white' }}>
            {canvas}/{totalCanvases}
          </span>
          {nextCanvasLink ? (
            <NextLink {...nextCanvasLink} passHref legacyBehavior>
              <NavButton className={font('sans', -1)}>
                Next
                <Icon icon={chevron} rotate={270} />
              </NavButton>
            </NextLink>
          ) : (
            <NavButton $disabled className={font('sans', -1)}>
              Next
              <Icon icon={chevron} rotate={270} />
            </NavButton>
          )}
        </NavigationBar>
      ) : (
        <>
          <LeftZone>
            {!showZoomed &&
              canvases &&
              canvases.length > 1 &&
              !isMobileSidebarActive && (
                <ToolbarSegmentedControl
                  hideLabels={true}
                  items={[
                    {
                      id: 'pageView',
                      label: 'Page',
                      icon: singlePage,
                      dataGtmTrigger: 'item_view_page_button',
                      clickHandler() {
                        setGridVisible(false);
                      },
                    },
                    {
                      id: 'gridView',
                      label: 'Grid',
                      icon: gridView,
                      dataGtmTrigger: 'item_view_grid_button',
                      clickHandler() {
                        setGridVisible(true);
                      },
                    },
                  ]}
                  activeId={gridVisible ? 'gridView' : 'pageView'}
                />
              )}
          </LeftZone>

          {isEnhanced && isFullscreenEnabled && showFullscreenControl && (
            <RightZone>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <Space $h={{ size: 'sm', properties: ['margin-right'] }}>
                  <ViewerButton
                    $isDark
                    onClick={() => {
                      if (viewerRef?.current) {
                        if (
                          !document.fullscreenElement &&
                          !document['webkitFullscreenElement']
                        ) {
                          if (viewerRef.current.requestFullscreen) {
                            viewerRef.current.requestFullscreen();
                          } else if (
                            viewerRef.current['webkitRequestFullscreen']
                          ) {
                            viewerRef.current['webkitRequestFullscreen']();
                          }
                        } else {
                          if (document.exitFullscreen) {
                            document.exitFullscreen();
                          } else if (document['webkitExitFullscreen']) {
                            document['webkitExitFullscreen']();
                          }
                        }
                      }
                    }}
                  >
                    <Icon icon={maximise} />
                    <span style={{ marginLeft: '7px' }}>Full screen</span>
                  </ViewerButton>
                </Space>
              </div>
            </RightZone>
          )}
        </>
      )}
    </BottomBar>
  );
};

export default ViewerBottomBar;
