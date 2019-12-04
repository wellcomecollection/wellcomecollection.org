// @flow
import { type IIIFManifest } from '@weco/common/model/iiif';
import { lighten } from 'polished';
import styled from 'styled-components';
import { workUrl } from '@weco/common/services/catalogue/urls';
import type { LicenseData } from '@weco/common/utils/get-license-info';
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
  z-index: 2;
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
  width: 15%;
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
  width: ${props => (props.isEnhanced ? '85%' : '100%')};
  padding: ${props => `0 ${props.theme.spacingUnit * 2}px`};
`;

type Props = {|
  canvases: ?[],
  enhanced: boolean,
  showThumbs: boolean,
  setShowThumbs: Function,
  activeThumbnailRef: { current: HTMLElement | null },
  workId: string,
  viewToggleRef: { current: HTMLElement | null },
  currentManifestLabel: ?string,
  params: any, // TODO
  canvasIndex: number,
  title: string,
  licenseInfo: ?LicenseData,
  iiifPresentationLicenseInfo: any, // TODO
  iiifImageLocationCredit: any, // TODO
  iiifImageLocationLicenseId: any, // TODO
  downloadOptions: any, // TODO
  iiifPresentationDownloadOptions: any, // TODO
  parentManifest: ?IIIFManifest,
  lang: string,
|};

const ViewerTopBar = ({
  canvases,
  enhanced,
  showThumbs,
  setShowThumbs,
  activeThumbnailRef,
  workId,
  viewToggleRef,
  currentManifestLabel,
  params,
  canvasIndex,
  title,
  licenseInfo,
  iiifPresentationLicenseInfo,
  iiifImageLocationCredit,
  iiifImageLocationLicenseId,
  downloadOptions,
  iiifPresentationDownloadOptions,
  parentManifest,
  lang,
}: Props) => {
  return (
    <TopBar className="flex">
      {enhanced && canvases && canvases.length > 1 && (
        <ViewAllContainer>
          <Button
            extraClasses="btn--primary-black"
            icon={showThumbs ? 'detailView' : 'gridView'}
            text={showThumbs ? 'Detail view' : 'View all'}
            fontFamily="hnl"
            clickHandler={() => {
              activeThumbnailRef &&
                activeThumbnailRef.current &&
                activeThumbnailRef.current.focus();
              setShowThumbs(!showThumbs);
              trackEvent({
                category: 'Control',
                action: `clicked work viewer ${
                  showThumbs ? '"Detail view"' : '"View all"'
                } button`,
                label: `${workId}`,
              });
            }}
            ref={viewToggleRef}
          />
        </ViewAllContainer>
      )}
      <TitleContainer isEnhanced={enhanced}>
        <div className="title">
          <span className="part">{currentManifestLabel}</span>
          <NextLink {...workUrl({ ...params, id: workId })}>
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
            <Space h={{ size: 'm', properties: ['margin-right'] }}>
              <Download
                title={title}
                workId={workId}
                licenseInfo={licenseInfo || iiifPresentationLicenseInfo}
                iiifImageLocationLicenseId={iiifImageLocationLicenseId}
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
                params={params}
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
