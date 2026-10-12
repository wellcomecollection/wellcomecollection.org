import { FunctionComponent } from 'react';
import styled from 'styled-components';

import { useAppContext } from '@weco/common/contexts/AppContext';
import { useKiosk } from '@weco/common/contexts/KioskContext';
import { useUserContext } from '@weco/common/contexts/UserContext';
import { chevrons, gridView, singlePage } from '@weco/common/icons';
import { DigitalLocation } from '@weco/common/model/catalogue';
import { typography } from '@weco/common/utils/classnames';
import { OptionalToUndefined } from '@weco/common/utils/utility-types';
import Icon from '@weco/common/views/components/Icon';
import Space from '@weco/common/views/components/styled/Space';
import { useItemViewerContext } from '@weco/content/contexts/ItemViewerContext/refactored';
import useDownloadOptions from '@weco/content/hooks/useDownloadOptions';
import useIsFullscreenEnabled from '@weco/content/hooks/useIsFullscreenEnabled';
import { hasRealLabel } from '@weco/content/utils/works';
import Download from '@weco/content/views/components/Download';

import CanvasPositionIndicator from './CanvasPositionIndicator';
import FullscreenToggleButton from './FullscreenToggleButton';
import ToolbarSegmentedControl from './ToolbarSegmentedControl';
import { ViewerButton } from './ViewerButton.styles';

const TopBar = styled.div<{
  $isZooming: boolean;
  $isDesktopSidebarActive: boolean;
  $useFixedList?: boolean;
  $hasMultipleCanvases?: boolean;
}>`
  display: ${props => (props.$isZooming ? 'none' : 'grid')};
  min-height: 52px;
  position: relative;
  z-index: 3;
  background: ${props => props.theme.color('neutral.700')};
  color: ${props => props.theme.color('white')};
  justify-content: space-between;
  grid-template-columns:
    [left-edge] ${props =>
      props.$useFixedList || !props.$hasMultipleCanvases
        ? 'minmax(200px, 3fr)'
        : 'minmax(200px, 630px)'}
    [desktop-sidebar-end main-start desktop-topbar-start] 9fr [right-edge];

  ${props => props.theme.media('sm')`
    display: grid;
  `}

  ${props =>
    props.theme.media('lg')(
      `grid-template-columns: [left-edge] ${props.$useFixedList || !props.$hasMultipleCanvases ? 'minmax(200px, 330px)' : 'minmax(200px, 630px)'} [desktop-sidebar-end main-start desktop-topbar-start] 9fr [right-edge];`
    )}

  ${props =>
    !props.$isDesktopSidebarActive &&
    `
      grid-template-columns: [left-edge] min-content [desktop-sidebar-end main-start desktop-topbar-start] 9fr [right-edge];
  `}

  ${props =>
    !props.$isDesktopSidebarActive &&
    props.theme.media('lg')`
      grid-template-columns: [left-edge] min-content [desktop-sidebar-end main-start desktop-topbar-start] 9fr [right-edge];
  `}
`;

const TopBarSidebarZone = styled(Space).attrs({
  $v: { size: 'xs', properties: ['padding-top', 'padding-bottom'] },
  $h: { size: 'xs', properties: ['padding-left', 'padding-right'] },
})<{ $isZooming: boolean }>`
  grid-column: left-edge / desktop-sidebar-end;
  display: flex;
  justify-content: flex-start;
  align-items: center;

  ${props =>
    props.theme.media('sm')(`
    justify-content: flex-end;
  `)}

  ${props =>
    !props.$isZooming &&
    props.theme.media('sm')(`
      border-right: 1px solid ${props.theme.color('black')};
  `)}
`;

const Main = styled(Space).attrs({
  $v: { size: 'xs', properties: ['padding-top', 'padding-bottom'] },
  $h: { size: 'xs', properties: ['padding-left', 'padding-right'] },
})`
  display: flex;
  justify-content: flex-end;

  ${props => props.theme.media('sm')`
    min-width: 450px;
    justify-content: space-between;
  `}
`;

const LeftZone = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
`;

const MiddleZone = styled.div.attrs({
  className: typography('body', 'md', 'strong'),
})`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const RightZone = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  width: 150px;
`;

type ViewerTopBarProps = OptionalToUndefined<{
  iiifImageLocation?: DigitalLocation;
}>;

const ViewerTopBar: FunctionComponent<ViewerTopBarProps> = ({
  iiifImageLocation,
}) => {
  const { isEnhanced, isFullSupportBrowser } = useAppContext();
  const { isKiosk } = useKiosk();
  const isFullscreenEnabled = useIsFullscreenEnabled();
  const {
    gridVisible,
    setGridVisible,
    isMobileSidebarActive,
    setIsMobileSidebarActive,
    isDesktopSidebarActive,
    setIsDesktopSidebarActive,
    showZoomed,
    isResizing,
    showFullscreenControl,
    hasOnlyRenderableImages,
    currentCanvas,
    isCurrentCanvasRestricted,
    hasMultipleCanvases,
  } = useItemViewerContext();
  const { userIsStaffWithRestricted } = useUserContext();
  const downloadOptions = useDownloadOptions(iiifImageLocation);

  const currentPageLabel = currentCanvas?.label?.trim();

  const shouldShowViewToggle =
    !showZoomed && hasMultipleCanvases && isFullSupportBrowser;
  const shouldShowPageIndicator =
    hasMultipleCanvases && !showZoomed && !isResizing;

  return (
    <TopBar
      data-testid="topbar"
      $isZooming={showZoomed}
      $isDesktopSidebarActive={isDesktopSidebarActive}
      $useFixedList={hasOnlyRenderableImages}
      $hasMultipleCanvases={hasMultipleCanvases}
    >
      <TopBarSidebarZone $isZooming={showZoomed}>
        {isEnhanced && !showZoomed && (
          <>
            <ViewerButton
              data-gtm-trigger="toggle_side_panel"
              className="viewer-desktop"
              $isDark
              onClick={() => {
                setIsDesktopSidebarActive(!isDesktopSidebarActive);
              }}
            >
              <Icon
                icon={chevrons}
                iconColor="white"
                rotate={isDesktopSidebarActive ? undefined : 180}
              />
              <span className="visually-hidden">
                {isDesktopSidebarActive ? 'Hide info' : 'Show info'}
              </span>
            </ViewerButton>

            <ViewerButton
              className="viewer-mobile"
              $isDark
              onClick={() => {
                setIsMobileSidebarActive(!isMobileSidebarActive);
              }}
            >
              {isMobileSidebarActive ? 'Hide info' : 'Show info'}
            </ViewerButton>
          </>
        )}
      </TopBarSidebarZone>

      <Main>
        {hasOnlyRenderableImages && (
          <LeftZone className="viewer-desktop">
            {shouldShowViewToggle && (
              <ToolbarSegmentedControl
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
                hideLabels
              />
            )}
          </LeftZone>
        )}

        <MiddleZone className="viewer-desktop">
          {shouldShowPageIndicator && (
            <>
              <CanvasPositionIndicator positionTestId="active-index" />{' '}
              {hasRealLabel(currentPageLabel) &&
                hasOnlyRenderableImages &&
                `page ${currentPageLabel}`}
            </>
          )}
        </MiddleZone>

        <RightZone>
          {isEnhanced && (
            <div style={{ display: 'flex', alignItems: 'center' }}>
              {downloadOptions.length > 0 &&
                (!isCurrentCanvasRestricted || userIsStaffWithRestricted) &&
                !isKiosk && (
                  <Space $h={{ size: 'xs', properties: ['margin-right'] }}>
                    <Download
                      ariaControlsId="itemDownloads"
                      downloadOptions={downloadOptions}
                      useDarkControl
                      isInline
                    />
                  </Space>
                )}

              {isFullscreenEnabled && showFullscreenControl && (
                <FullscreenToggleButton className="viewer-desktop" />
              )}
            </div>
          )}
        </RightZone>
      </Main>
    </TopBar>
  );
};

export default ViewerTopBar;
