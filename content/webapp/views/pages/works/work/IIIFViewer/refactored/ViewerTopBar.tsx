import { ChoiceBody, ImageService } from '@iiif/presentation-3';
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
import useIsFullscreenEnabled from '@weco/content/hooks/useIsFullscreenEnabled';
import useTransformedIIIFImage from '@weco/content/hooks/useTransformedIIIFImage';
import {
  deduplicateDownloadOptions,
  getDownloadOptionsFromCanvasRenderingAndSupplementing,
  getDownloadOptionsFromManifestRendering,
  getImageServiceFromItem,
  getVideoAudioDownloadOptions,
  isChoiceBody,
} from '@weco/content/utils/iiif/v3';
import { getDownloadOptionsFromImageUrl } from '@weco/content/utils/works';
import Download from '@weco/content/views/components/Download';

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
    work,
    isMobileSidebarActive,
    setIsMobileSidebarActive,
    isDesktopSidebarActive,
    setIsDesktopSidebarActive,
    showZoomed,
    isResizing,
    transformedManifest,
    query,
    showFullscreenControl,
    hasOnlyRenderableImages,
    currentCanvas,
    isCurrentCanvasRestricted,
    hasMultipleCanvases,
  } = useItemViewerContext();
  const transformedIIIFImage = useTransformedIIIFImage(work);
  const { userIsStaffWithRestricted } = useUserContext();

  const { canvases, rendering } = { ...transformedManifest };
  const imageServices = (currentCanvas?.painting
    .map(p => {
      if (isChoiceBody(p)) {
        return p.items.map(item =>
          getImageServiceFromItem(item as unknown as ChoiceBody)
        );
      } else {
        return getImageServiceFromItem(p);
      }
    })
    .flat()
    .filter(Boolean) || []) as ImageService[];
  const currentPageLabel = currentCanvas?.label?.trim();

  const shouldShowViewToggle =
    !showZoomed && hasMultipleCanvases && isFullSupportBrowser;
  const shouldShowPageIndicator =
    hasMultipleCanvases && !showZoomed && !isResizing;

  // Works can have a DigitalLocation of type iiif-presentation and/or iiif-image.
  // For a iiif-presentation DigitalLocation we get the download options from the manifest to which it points.
  // For a iiif-image DigitalLocation we create the download options
  // from a combination of the DigitalLocation and the iiif-image json to which it points.
  // The json provides the image width and height used in the link text.
  // Since this isn't vital to rendering the links, the useTransformedIIIFImage hook
  // gets this data client side.
  // Sometimes we render images for works that have neither a iiif-image or a iiif-presentation location type.
  // In this case we use the iiifImageLocation passed from the serverSideProps of the /images.tsx
  const iiifImageDownloadOptions = iiifImageLocation
    ? getDownloadOptionsFromImageUrl({
        url: iiifImageLocation.url,
        width: transformedIIIFImage.width,
        height: transformedIIIFImage.height,
      })
    : [];

  // We also want to offer download options for each canvas image
  // in the iiif-presentation manifest when it is being viewed.
  const canvasImageDownloads = imageServices
    .map(imageService => {
      if (imageService['@id']) {
        return getDownloadOptionsFromImageUrl({
          url: imageService['@id'],
          width: imageService.width || undefined,
          height: imageService.height || undefined,
        });
      } else {
        return [];
      }
    })
    .flat()
    .filter(Boolean);

  const canvasDownloadOptions = currentCanvas
    ? getDownloadOptionsFromCanvasRenderingAndSupplementing(currentCanvas)
    : [];

  const manifestDownloadOptions =
    getDownloadOptionsFromManifestRendering(rendering);

  const videoAudioDownloadOptions = getVideoAudioDownloadOptions(currentCanvas);

  // We need multiple sources for downloads to cover the different
  // ways in which a download can be made available in a iiif manifest.
  // The same file can appear in multiple sources, so we deduplicate by id.
  const downloadOptions = deduplicateDownloadOptions([
    ...iiifImageDownloadOptions,
    ...canvasImageDownloads,
    ...canvasDownloadOptions,
    ...manifestDownloadOptions,
    ...videoAudioDownloadOptions,
  ]);

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
              <span data-testid="active-index">{`${query.canvas || 0}`}</span>
              {`/${canvases?.length || ''}`}{' '}
              {currentPageLabel !== '-' &&
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
