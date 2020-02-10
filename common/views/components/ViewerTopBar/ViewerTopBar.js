// @flow
import { type IIIFManifest, type IIIFRendering } from '@weco/common/model/iiif';
import type { LicenseData } from '@weco/common/utils/licenses';
import { lighten } from 'polished';
import styled from 'styled-components';
import { workLink } from '@weco/common/services/catalogue/routes';
import { classNames, font } from '@weco/common/utils/classnames';
import NextLink from 'next/link';
import Button from '@weco/common/views/components/Buttons/Button/Button';
import TruncatedText from '@weco/common/views/components/TruncatedText/TruncatedText';
import { trackEvent } from '@weco/common/utils/ga';
import Download from '@weco/catalogue/components/Download/ViewerDownload';
import MultipleManifestList from '@weco/catalogue/components/MultipleManifestList/MultipleManifestList';
import Icon from '@weco/common/views/components/Icon/Icon';
import Space from '@weco/common/views/components/styled/Space';

const TopBar = styled.div`
  position: relative;
  z-index: 3;
  background: ${props => lighten(0.14, props.theme.colors.viewerBlack)};
  color: ${props => props.theme.colors.white};
  .title {
    max-width: 30%;
    .icon {
      width: 48px;
    }
  }
  h1 {
    margin: 0;
  }
  .part {
    max-width: 100%;
    display: block;
    @media (min-width: ${props => props.theme.sizes.large}px) {
      display: none;
    }
  }
  .plain-link {
    max-width: 100%;
  }
  .icon__shape {
    fill: currentColor;
  }
  button {
    overflow: hidden;
    display: inline-block;
    .btn__text {
      position: absolute;
      right: 100%;
      @media (min-width: ${props => props.theme.sizes.large}px) {
        position: static;
      }
    }
  }
`;

const ViewAllContainer = styled.div.attrs(props => ({
  className: classNames({
    'flex flex--v-center flex--h-center': true,
  }),
}))`
  height: 64px;
  width: 20%;
  border-right: 1px solid
    ${props => lighten(0.1, props.theme.colors.viewerBlack)};
`;

const TitleContainer = styled.div.attrs(props => ({
  className: classNames({
    'flex flex--v-center': true,
    [font('hnl', 5)]: true,
  }),
}))`
  justify-content: space-between;
  height: 64px;
  width: ${props => (props.isEnhanced ? '80%' : '100%')};
  padding: ${props => `0 ${props.theme.spacingUnit * 2}px`};
`;

type Props = {|
  canvases: [],
  enhanced: boolean,
  gridVisible: boolean,
  setGridVisible: Function,
  workId: string,
  viewToggleRef: { current: HTMLElement | null },
  currentManifestLabel: ?string,
  canvasIndex: number,
  title: string,
  licenseInfo: LicenseData[],
  iiifImageLocationCredit: ?string,
  downloadOptions: ?(IIIFRendering[]),
  iiifPresentationDownloadOptions: IIIFRendering[],
  parentManifest: ?IIIFManifest,
  lang: string,
  viewerRef: { current: HTMLElement | null },
|};

const ViewerTopBar = ({
  canvases,
  enhanced,
  gridVisible,
  setGridVisible,
  workId,
  viewToggleRef,
  currentManifestLabel,
  canvasIndex,
  title,
  licenseInfo,
  iiifImageLocationCredit,
  downloadOptions,
  iiifPresentationDownloadOptions,
  parentManifest,
  lang,
  viewerRef,
}: Props) => {
  return (
    <TopBar className="flex">
      {enhanced && canvases && canvases.length > 1 && (
        <ViewAllContainer>
          <Button
            extraClasses="btn--primary-black"
            icon={gridVisible ? 'detailView' : 'gridView'}
            text={gridVisible ? 'Detail view' : 'View all'}
            fontFamily="hnl"
            clickHandler={() => {
              setGridVisible(!gridVisible);
              trackEvent({
                category: 'Control',
                action: `clicked work viewer ${
                  gridVisible ? '"Detail view"' : '"View all"'
                } button`,
                label: `${workId}`,
              });
            }}
            ref={viewToggleRef}
          />
        </ViewAllContainer>
      )}
      <TitleContainer isEnhanced={enhanced && canvases && canvases.length > 1}>
        <div className="title">
          <span className="part">{currentManifestLabel}</span>
          <NextLink {...workLink({ id: workId })}>
            <a
              className={classNames({
                [font('hnm', 5)]: true,
                flex: true,
                'flex-v-center': true,
                'plain-link': true,
                'font-hover-yellow': true,
              })}
            >
              <Icon name="chevron" extraClasses="icon--90 icon--white" />
              <TruncatedText as="h1">{title}</TruncatedText>
            </a>
          </NextLink>
        </div>
        {canvases && canvases.length > 1 && (
          <>{`${canvasIndex + 1 || ''} / ${(canvases && canvases.length) ||
            ''}`}</>
        )}
        {enhanced && (
          <div className="flex flex--v-center">
            {document &&
              (document.fullscreenEnabled ||
                // $FlowFixMe
                document.webkitFullscreenEnabled) && (
                <Space h={{ size: 'm', properties: ['margin-right'] }}>
                  <Button
                    extraClasses="btn--primary-black"
                    icon="expand"
                    text="Full screen"
                    fontFamily="hnl"
                    clickHandler={() => {
                      if (viewerRef && viewerRef.current) {
                        if (
                          !document.fullscreenElement &&
                          // $FlowFixMe
                          !document.webkitFullscreenElement
                        ) {
                          if (viewerRef.current.requestFullscreen) {
                            viewerRef.current.requestFullscreen();
                          } else if (
                            // $FlowFixMe
                            viewerRef.current.webkitRequestFullscreen
                          ) {
                            viewerRef.current.webkitRequestFullscreen();
                          }
                        } else {
                          if (document.exitFullscreen) {
                            document.exitFullscreen();
                            // $FlowFixMe
                          } else if (document.webkitExitFullscreen) {
                            // $FlowFixMe
                            document.webkitExitFullscreen();
                          }
                        }
                      }
                    }}
                  />
                </Space>
              )}
            <Space h={{ size: 'm', properties: ['margin-right'] }}>
              <Download
                title={title}
                workId={workId}
                licenseInfo={licenseInfo}
                iiifImageLocationCredit={iiifImageLocationCredit}
                downloadOptions={
                  downloadOptions || iiifPresentationDownloadOptions
                }
              />
            </Space>
            {parentManifest && parentManifest.manifests && (
              <MultipleManifestList
                buttonText={currentManifestLabel || 'Choose'}
                manifests={parentManifest.manifests}
                workId={workId}
                lang={lang}
              />
            )}
          </div>
        )}
      </TitleContainer>
    </TopBar>
  );
};

export default ViewerTopBar;
