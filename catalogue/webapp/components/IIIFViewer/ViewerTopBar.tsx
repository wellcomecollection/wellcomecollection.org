import styled from 'styled-components';
import { font } from '@weco/common/utils/classnames';
import { trackEvent } from '@weco/common/utils/ga';
import Download from '@weco/catalogue/components/Download/Download';
import Icon from '@weco/common/views/components/Icon/Icon';
import Space from '@weco/common/views/components/styled/Space';
import { FunctionComponent, useContext, RefObject } from 'react';
import { AppContext } from '@weco/common/views/components/AppContext/AppContext';
import ItemViewerContext from '../ItemViewerContext/ItemViewerContext';
import useIsFullscreenEnabled from '@weco/common/hooks/useIsFullscreenEnabled';
import ToolbarSegmentedControl from '@weco/common/views/components/ToolbarSegmentedControl/ToolbarSegmentedControl';
import {
  chevrons,
  collapse,
  expand,
  gridView,
  singlePage,
} from '@weco/common/icons';

// TODO: update this with a more considered button from our system
export const ShameButton = styled.button.attrs(() => ({
  className: font('intb', 5),
}))<{ isDark?: boolean }>`
  line-height: 1.5;
  border-radius: ${props => props.theme.borderRadiusUnit}px;
  text-decoration: none;
  text-align: center;
  transition: all ${props => props.theme.transitionProperties};
  border: 0;
  white-space: nowrap;
  padding: 6px 12px;
  position: relative;
  display: flex;
  align-items: center;

  &:not([disabled]):hover,
  &:not([disabled]):focus {
    cursor: pointer;
  }

  &[disabled],
  &.disabled {
    background: ${props => props.theme.color('neutral.600')};
    border-color: ${props => props.theme.color('neutral.600')};
    cursor: not-allowed;
  }

  &.disabled {
    pointer-events: none;
  }

  .icon {
    display: inline-block;
    vertical-align: middle;
  }

  overflow: hidden;

  ${props =>
    props.isDark &&
    `
    border: 2px solid transparent;
    color: ${props.theme.color('white')};
    background: transparent;
    outline: none;
    transition: all ${props.theme.transitionProperties};

    .btn__text {
      position: absolute;
      right: 100%;

      ${props.theme.media('large')`
        position: static;
      `}
    }

    &:not([disabled]):hover {
      border: 2px solid ${props.theme.color('white')};
    }
  `}

  ${props =>
    !props.isDark &&
    `
    background: ${props.theme.color('white')};
    color: ${props.theme.color('accent.green')};
    border: 1px solid ${props.theme.color('accent.green')};

    &:not([disabled]):hover,
    &:not([disabled]):focus {
      background: ${props.theme.color('accent.green')};
      color: ${props.theme.color('white')};
    }
  `}
`;

const TopBar = styled.div<{
  isZooming: boolean;
  isDesktopSidebarActive: boolean;
}>`
  display: flex;
  position: relative;
  z-index: 3;
  background: ${props => props.theme.color('neutral.700')};
  color: ${props => props.theme.color('white')};
  justify-content: space-between;
  display: ${props => (props.isZooming ? 'none' : 'grid')};
  grid-template-columns: [left-edge] minmax(200px, 3fr) [desktop-sidebar-end main-start desktop-topbar-start] 9fr [right-edge];

  ${props => props.theme.media('medium')`
    display: grid;
  `}

  ${props =>
    props.theme.media('xlarge')`
      grid-template-columns: [left-edge] minmax(200px, 330px) [desktop-sidebar-end main-start desktop-topbar-start] 9fr [right-edge];
  `}

  ${props =>
    !props.isDesktopSidebarActive &&
    `
      grid-template-columns: [left-edge] min-content [desktop-sidebar-end main-start desktop-topbar-start] 9fr [right-edge];
  `}

  ${props =>
    !props.isDesktopSidebarActive &&
    props.theme.media('xlarge')`
      grid-template-columns: [left-edge] min-content [desktop-sidebar-end main-start desktop-topbar-start] 9fr [right-edge];
  `}
`;

const Sidebar = styled(Space).attrs({
  v: { size: 's', properties: ['padding-top', 'padding-bottom'] },
  h: { size: 's', properties: ['padding-left', 'padding-right'] },
})<{ isZooming: boolean }>`
  grid-column-start: left-edge;
  grid-column-end: desktop-sidebar-end;
  display: flex;
  justify-content: flex-start;
  align-items: center;

  ${props => props.theme.media('medium')`
    justify-content: flex-end;
  `}

  ${props =>
    !props.isZooming &&
    props.theme.media('medium')(`
      border-right: 1px solid ${props.theme.color('black')};
  `)}
`;

const Main = styled(Space).attrs({
  v: { size: 's', properties: ['padding-top', 'padding-bottom'] },
  h: { size: 's', properties: ['padding-left', 'padding-right'] },
})`
  display: flex;
  justify-content: flex-end;

  ${props => props.theme.media('medium')`
    justify-content: space-between;
  `}
`;

const LeftZone = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
`;

const MiddleZone = styled.div.attrs({
  className: font('intb', 5),
})`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const RightZone = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
`;

type Props = {
  viewToggleRef: RefObject<HTMLButtonElement>;
  viewerRef: RefObject<HTMLDivElement>;
};

const ViewerTopBar: FunctionComponent<Props> = ({ viewerRef }: Props) => {
  const { isEnhanced } = useContext(AppContext);
  const isFullscreenEnabled = useIsFullscreenEnabled();
  const {
    gridVisible,
    setGridVisible,
    work,
    activeIndex,
    licenseInfo,
    iiifImageLocationCredit,
    downloadOptions,
    setIsMobileSidebarActive,
    setIsDesktopSidebarActive,
    isMobileSidebarActive,
    isDesktopSidebarActive,
    showZoomed,
    isResizing,
    transformedManifest,
  } = useContext(ItemViewerContext);
  const { canvases } = transformedManifest;
  return (
    <TopBar
      isZooming={showZoomed}
      isDesktopSidebarActive={isDesktopSidebarActive}
    >
      {isEnhanced && (
        <Sidebar isZooming={showZoomed}>
          {!showZoomed && (
            <>
              <ShameButton
                data-test-id="toggle-info-desktop"
                className="viewer-desktop"
                isDark
                onClick={() => {
                  setIsDesktopSidebarActive(!isDesktopSidebarActive);
                  trackEvent({
                    category: 'Control',
                    action: 'Toggle item viewer sidebar',
                    label: `${work.id}`,
                  });
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
              </ShameButton>
              <ShameButton
                data-test-id="toggle-info-mobile"
                className="viewer-mobile"
                isDark
                onClick={() => {
                  setIsMobileSidebarActive(!isMobileSidebarActive);
                }}
              >
                {isMobileSidebarActive ? 'Hide info' : 'Show info'}
              </ShameButton>
            </>
          )}
        </Sidebar>
      )}
      <Main>
        <LeftZone className="viewer-desktop">
          {!showZoomed && canvases && canvases.length > 1 && (
            <ToolbarSegmentedControl
              hideLabels={true}
              items={[
                {
                  id: 'pageView',
                  label: 'Page',
                  icon: singlePage,
                  clickHandler() {
                    setGridVisible(false);
                    trackEvent({
                      category: 'Control',
                      action: 'clicked work viewer Detail view button',
                      label: `${work.id}`,
                    });
                  },
                },
                {
                  id: 'gridView',
                  label: 'Grid',
                  icon: gridView,
                  clickHandler() {
                    setGridVisible(true);
                    trackEvent({
                      category: 'Control',
                      action: 'clicked work viewer Grid view button',
                      label: `${work.id}`,
                    });
                  },
                },
              ]}
              activeId={gridVisible ? 'gridView' : 'pageView'}
            />
          )}
        </LeftZone>
        <MiddleZone className="viewer-desktop">
          {canvases?.length > 1 && !showZoomed && !isResizing && (
            <>
              <span data-test-id="active-index">{`${
                activeIndex + 1 || 0
              }`}</span>
              {`/${canvases?.length || ''}`}{' '}
              {!(canvases[activeIndex]?.label?.trim() === '-') &&
                `(page ${canvases[activeIndex]?.label?.trim()})`}
            </>
          )}
        </MiddleZone>
        <RightZone>
          {isEnhanced && (
            <div className="flex flex--v-center">
              {!showZoomed && (
                <Space h={{ size: 's', properties: ['margin-right'] }}>
                  <Download
                    ariaControlsId="itemDownloads"
                    title={work.title}
                    workId={work.id}
                    license={licenseInfo}
                    iiifImageLocationCredit={iiifImageLocationCredit}
                    downloadOptions={downloadOptions}
                    useDarkControl={true}
                    isInline={true}
                  />
                </Space>
              )}
              {isFullscreenEnabled && (
                <ShameButton
                  className="viewer-desktop"
                  isDark
                  onClick={() => {
                    if (viewerRef && viewerRef.current) {
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
                  {document.fullscreenElement ||
                  document['webkitFullscreenElement'] ? (
                    <>
                      <Icon icon={collapse} />
                      Exit full screen
                    </>
                  ) : (
                    <>
                      <Icon icon={expand} />
                      <span className="btn__text">Full screen</span>
                    </>
                  )}
                </ShameButton>
              )}
            </div>
          )}
        </RightZone>
      </Main>
    </TopBar>
  );
};

export default ViewerTopBar;
