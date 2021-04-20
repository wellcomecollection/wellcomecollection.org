import styled from 'styled-components';
import { classNames, font } from '@weco/common/utils/classnames';
import { trackEvent } from '@weco/common/utils/ga';
import Download from '@weco/catalogue/components/Download/Download';
import Icon from '@weco/common/views/components/Icon/Icon';
import Space from '@weco/common/views/components/styled/Space';
import { FunctionComponent, useContext, RefObject } from 'react';
import { AppContext } from '@weco/common/views/components/AppContext/AppContext';
import ItemViewerContext from '@weco/common/views/components/ItemViewerContext/ItemViewerContext';
import useIsFullscreenEnabled from '@weco/common/hooks/useIsFullscreenEnabled';

// TODO: update this with a more considered button from our system
export const ShameButton = styled.button.attrs(() => ({
  className: classNames({
    'btn relative flex flex--v-center': true,
    [font('hnm', 5)]: true,
  }),
}))<{ isDark?: boolean }>`
  overflow: hidden;

  ${props =>
    props.isDark &&
    `
    border: 2px solid ${props.theme.color('transparent')};
    color: ${props.theme.color('white')};
    background: transparent;
    outline: none;
    transition: all ${props.theme.transitionProperties};

    .btn__text {
      position: absolute;
      right: 100%;
      @media (min-width: ${props.theme.sizes.large}px) {
        position: static;
      }
    }

    &:not([disabled]):hover {
      border: 2px solid ${props.theme.color('white')};
    }
  `}

  ${props =>
    !props.isDark &&
    `
    background: ${props.theme.color('white')};
    color: ${props.theme.color('green')};
    border: 1px solid ${props.theme.color('green')};

    &:not([disabled]):hover,
    &:not([disabled]):focus {
      background: ${props.theme.color('green')};
      color: ${props.theme.color('white')};
    }
  `}
`;

const TopBar = styled.div<{
  isZooming: boolean;
  isDesktopSidebarActive: boolean;
}>`
  position: relative;
  z-index: 3;
  background: ${props => props.theme.color('charcoal')};
  color: ${props => props.theme.color('white')};
  justify-content: space-between;
  display: ${props => (props.isZooming ? 'none' : 'grid')};
  grid-template-columns: [left-edge] minmax(200px, 3fr) [desktop-sidebar-end main-start desktop-topbar-start] 9fr [right-edge];

  ${props => props.theme.media.medium`
    display: grid;
  `}

  ${props =>
    props.theme.media.xlarge`
      grid-template-columns: [left-edge] minmax(200px, 330px) [desktop-sidebar-end main-start desktop-topbar-start] 9fr [right-edge];
  `}

  ${props =>
    !props.isDesktopSidebarActive &&
    `
      grid-template-columns: [left-edge] min-content [desktop-sidebar-end main-start desktop-topbar-start] 9fr [right-edge];
  `}

  ${props =>
    !props.isDesktopSidebarActive &&
    props.theme.media.xlarge`
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

  ${props =>
    !props.isZooming &&
    props.theme.media.medium`
    border-right: 1px solid ${props => props.theme.color('viewerBlack')};
  `}
`;

const Main = styled(Space).attrs({
  v: { size: 's', properties: ['padding-top', 'padding-bottom'] },
  h: { size: 's', properties: ['padding-left', 'padding-right'] },
})`
  grid-column-start: desktop-sidebar-end;
  grid-column-end: right-edge;
  display: none;
  justify-content: space-between;

  ${props => props.theme.media.medium`
    display: flex;
  `}
`;

const LeftZone = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
`;

const MiddleZone = styled.div.attrs({
  className: classNames({
    [font('hnm', 5)]: true,
  }),
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

const ViewerTopBar: FunctionComponent<Props> = ({
  viewToggleRef,
  viewerRef,
}: Props) => {
  const { isEnhanced } = useContext(AppContext);
  const isFullscreenEnabled = useIsFullscreenEnabled();
  const {
    canvases,
    gridVisible,
    setGridVisible,
    work,
    activeIndex,
    licenseInfo,
    iiifImageLocationCredit,
    downloadOptions,
    iiifPresentationDownloadOptions,
    setIsMobileSidebarActive,
    setIsDesktopSidebarActive,
    isMobileSidebarActive,
    isDesktopSidebarActive,
    showZoomed,
    isResizing,
  } = useContext(ItemViewerContext);
  return (
    <TopBar
      className="flex"
      isZooming={showZoomed}
      isDesktopSidebarActive={isDesktopSidebarActive}
    >
      {isEnhanced && canvases && canvases.length > 1 && (
        <Sidebar isZooming={showZoomed}>
          {!showZoomed && (
            <>
              <ShameButton
                className={`viewer-desktop`}
                isDark
                onClick={() => {
                  setIsDesktopSidebarActive(!isDesktopSidebarActive);
                }}
              >
                <Icon
                  name={`chevrons`}
                  extraClasses={classNames({
                    'icon--white': true,
                    'icon--180': !isDesktopSidebarActive,
                  })}
                />
                {isDesktopSidebarActive ? 'Hide' : 'Show'}
                {' info'}
              </ShameButton>
              <ShameButton
                className={`viewer-mobile`}
                isDark
                onClick={() => {
                  setIsMobileSidebarActive(!isMobileSidebarActive);
                }}
              >
                {isMobileSidebarActive ? 'Hide' : 'Show'}
                {' info'}
              </ShameButton>
            </>
          )}
        </Sidebar>
      )}
      <Main>
        <LeftZone>
          {!showZoomed && (
            <ShameButton
              className={`viewer-desktop`}
              isDark
              ref={viewToggleRef}
              onClick={() => {
                setGridVisible(!gridVisible);
                trackEvent({
                  category: 'Control',
                  action: `clicked work viewer ${
                    gridVisible ? '"Detail view"' : '"View all"'
                  } button`,
                  label: `${work.id}`,
                });
              }}
            >
              <Icon name={gridVisible ? 'detailView' : 'gridView'} />
              <span className={`btn__text`}>
                {gridVisible ? 'Detail view' : 'View all'}
              </span>
            </ShameButton>
          )}
        </LeftZone>
        <MiddleZone>
          {canvases && canvases.length > 1 && !showZoomed && !isResizing && (
            <>
              <span data-test-id="active-index">{`${activeIndex + 1 ||
                ''}`}</span>
              {` / ${(canvases && canvases.length) || ''}`}{' '}
              {!(canvases[activeIndex].label.trim() === '-') &&
                `(page ${canvases[activeIndex].label.trim()})`}
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
                    downloadOptions={
                      downloadOptions || iiifPresentationDownloadOptions
                    }
                    useDarkControl={true}
                    isInline={true}
                  />
                </Space>
              )}
              {isFullscreenEnabled && (
                <ShameButton
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
                  <Icon
                    name={
                      document.fullscreenElement ||
                      document['webkitFullscreenElement']
                        ? 'collapse'
                        : 'expand'
                    }
                  />
                  <span className={`btn__text`}>
                    {document.fullscreenElement ||
                    document['webkitFullscreenElement']
                      ? 'Exit full screen'
                      : 'Full screen'}
                  </span>
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
