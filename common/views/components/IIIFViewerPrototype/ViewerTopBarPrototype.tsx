import { lighten } from 'polished';
import styled from 'styled-components';
import { classNames, font } from '@weco/common/utils/classnames';
import { trackEvent } from '@weco/common/utils/ga';
import Download from '@weco/catalogue/components/Download/Download';
import Icon from '@weco/common/views/components/Icon/Icon';
import Space from '@weco/common/views/components/styled/Space';
import { FunctionComponent, useContext } from 'react';
import { AppContext } from '@weco/common/views/components/AppContext/AppContext';
import ItemViewerContext from '@weco/common/views/components/ItemViewerContext/ItemViewerContext';

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

const TopBar = styled.div<{ isZooming: boolean }>`
  position: relative;
  z-index: 3;
  background: ${props => lighten(0.14, props.theme.color('viewerBlack'))};
  color: ${props => props.theme.color('white')};
  justify-content: space-between;
  display: ${props => (props.isZooming ? 'none' : 'flex')};

  ${props => props.theme.media.medium`
    display: flex;
  `}
`;

const LeftZone = styled(Space).attrs({
  v: { size: 's', properties: ['padding-top', 'padding-bottom'] },
})`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  width: 30%;
`;
const MiddleZone = styled(Space).attrs({
  v: { size: 's', properties: ['padding-top', 'padding-bottom'] },
  className: classNames({
    [font('hnm', 5)]: true,
  }),
})`
  display: flex;
  justify-content: center;
  align-items: center;
`;
const RightZone = styled(Space).attrs({
  v: { size: 's', properties: ['padding-top', 'padding-bottom'] },
})`
  width: 30%;
  display: flex;
  justify-content: flex-end;
  align-items: center;
`;

type Props = {
  viewToggleRef: any;
  viewerRef: any;
};

const ViewerTopBar: FunctionComponent<Props> = ({
  viewToggleRef,
  viewerRef,
}: Props) => {
  const { isEnhanced } = useContext(AppContext);
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
    isMobileSidebarActive,
    showZoomed,
  } = useContext(ItemViewerContext);
  return (
    <TopBar className="flex" isZooming={showZoomed}>
      {isEnhanced && canvases && canvases.length > 1 && (
        <LeftZone>
          {!showZoomed && (
            <Space
              h={{ size: 's', properties: ['margin-left'] }}
              className={classNames({
                'flex flex--v-center flex--h-center': true,
              })}
            >
              <ShameButton
                className={`viewer-mobile`}
                isDark
                onClick={() => {
                  setIsMobileSidebarActive(!isMobileSidebarActive);
                }}
              >
                item infomation
              </ShameButton>

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
            </Space>
          )}
        </LeftZone>
      )}
      <MiddleZone>
        {canvases && canvases.length > 1 && !showZoomed && (
          <>
            {`${activeIndex + 1 || ''} / ${(canvases && canvases.length) ||
              ''}`}{' '}
            {!(canvases[activeIndex].label.trim() === '-') &&
              `(page ${canvases[activeIndex].label.trim()})`}
          </>
        )}
      </MiddleZone>
      <RightZone>
        {isEnhanced && (
          <div className="flex flex--v-center">
            {!showZoomed && (
              <>
                <Space h={{ size: 'm', properties: ['margin-right'] }}>
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
              </>
            )}
            {document &&
              (document.fullscreenEnabled ||
                document['webkitFullscreenEnabled']) && (
                <Space
                  h={{ size: 'm', properties: ['margin-right'] }}
                  className={`viewer-desktop`}
                >
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
                    <Icon name="expand" />
                    <span className={`btn__text`}>Full screen</span>
                  </ShameButton>
                </Space>
              )}
          </div>
        )}
      </RightZone>
    </TopBar>
  );
};

export default ViewerTopBar;
