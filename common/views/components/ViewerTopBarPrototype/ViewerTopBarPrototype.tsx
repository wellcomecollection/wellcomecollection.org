import { lighten } from 'polished';
import styled from 'styled-components';
import { classNames, font } from '@weco/common/utils/classnames';
import { trackEvent } from '@weco/common/utils/ga';
import Download from '@weco/catalogue/components/Download/Download';
import MultipleManifestList from '@weco/catalogue/components/MultipleManifestList/MultipleManifestList';
import Icon from '@weco/common/views/components/Icon/Icon';
import Space from '@weco/common/views/components/styled/Space';
import { FunctionComponent, useContext } from 'react';
import { AppContext } from '../AppContext/AppContext';
import ItemViewerContext from '../ItemViewerContext/ItemViewerContext';

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
    border: none;
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

    &:not([disabled]):hover,
    &:not([disabled]):focus {
      border-color: ${props.theme.color('black')};
      background: ${props.theme.color('yellow')};
      color: ${props.theme.color('black')};
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

const TopBar = styled.div`
  position: relative;
  z-index: 3;
  background: ${props => lighten(0.14, props.theme.color('viewerBlack'))};
  color: ${props => props.theme.color('white')};
  display: flex;
  justify-content: space-between;
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
    currentManifestLabel,
    activeIndex,
    licenseInfo,
    iiifImageLocationCredit,
    downloadOptions,
    iiifPresentationDownloadOptions,
    parentManifest,
    lang,
    manifestIndex,
    setIsSidebarActive,
    isSidebarActive,
  } = useContext(ItemViewerContext);
  return (
    <TopBar className="flex">
      {isEnhanced && canvases && canvases.length > 1 && (
        <LeftZone>
          <Space h={{ size: 's', properties: ['margin-right', 'margin-left'] }}>
            <ShameButton
              isDark
              onClick={() => setIsSidebarActive(!isSidebarActive)}
            >
              <Icon
                name={`chevron`}
                extraClasses={isSidebarActive ? 'icon--90' : 'icon--270'}
              />
              <span className={`btn__text`}>
                {isSidebarActive ? 'Info' : 'Info'}
              </span>
            </ShameButton>
          </Space>
          <ShameButton
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
        </LeftZone>
      )}
      <MiddleZone>
        {canvases && canvases.length > 1 && (
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
            {document &&
              (document.fullscreenEnabled ||
                document['webkitFullscreenEnabled']) && (
                <Space h={{ size: 'm', properties: ['margin-right'] }}>
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
            {parentManifest && parentManifest.manifests && (
              <MultipleManifestList
                buttonText={currentManifestLabel || 'Choose'}
                manifests={parentManifest.manifests}
                workId={work.id}
                lang={lang}
                manifestIndex={manifestIndex}
              />
            )}
          </div>
        )}
      </RightZone>
    </TopBar>
  );
};

export default ViewerTopBar;
