import NextLink from 'next/link';
import { FunctionComponent } from 'react';
import styled, { css } from 'styled-components';

import { useAppContext } from '@weco/common/contexts/AppContext';
import { chevron, gridView, maximise, singlePage } from '@weco/common/icons';
import { LinkProps } from '@weco/common/model/link-props';
import { typography } from '@weco/common/utils/classnames';
import Icon from '@weco/common/views/components/Icon';
import Space from '@weco/common/views/components/styled/Space';
import { useItemViewerContext } from '@weco/content/contexts/ItemViewerContext/refactored';
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

const NavigationBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: ${props => props.theme.spacingUnit * 2}px;
`;

const navButtonBaseStyles = css`
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
`;

// used for the disabled state, which isn't a real navigable link
const NavButton = styled.a<{ $disabled?: boolean }>`
  ${navButtonBaseStyles}

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

// used for the enabled state; Link renders its own single <a>, so this must
// not be nested inside another Link-rendered anchor
const NavLinkButton = styled(NextLink)`
  ${navButtonBaseStyles}

  &:hover {
    background: ${props => props.theme.color('neutral.500')};
  }
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

type CanvasNavButtonProps = {
  link: LinkProps | null;
  direction: 'previous' | 'next';
};

const CanvasNavButton: FunctionComponent<CanvasNavButtonProps> = ({
  link,
  direction,
}) => {
  const rotate = direction === 'previous' ? 90 : 270;
  const content = (
    <>
      {direction === 'next' && <>Next</>}
      <Icon icon={chevron} rotate={rotate} />
      {direction === 'previous' && <>Previous</>}
    </>
  );

  if (!link) {
    return (
      <NavButton className={typography('body', 'md', 'regular')} $disabled>
        {content}
      </NavButton>
    );
  }

  return (
    <NavLinkButton {...link} className={typography('body', 'md', 'regular')}>
      {content}
    </NavLinkButton>
  );
};

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
    totalCanvases,
    hasOnlyRenderableImages,
  } = useItemViewerContext();

  const { canvases } = { ...transformedManifest };
  const { canvas } = query;

  const canNavigatePrevious = canvas > 1;
  const canNavigateNext = canvas < totalCanvases;

  const previousCanvasLink = canNavigatePrevious
    ? toWorksItemLink({ workId: work.id, props: { canvas: canvas - 1 } })
    : null;
  const nextCanvasLink = canNavigateNext
    ? toWorksItemLink({ workId: work.id, props: { canvas: canvas + 1 } })
    : null;

  const hasMultipleCanvases = (canvases?.length || 0) > 1;
  const shouldShowCanvasNavigation =
    !hasOnlyRenderableImages && hasMultipleCanvases;
  const shouldShowViewToggle =
    !showZoomed && hasMultipleCanvases && !isMobileSidebarActive;
  const shouldShowFullscreenButton =
    isEnhanced && isFullscreenEnabled && showFullscreenControl;

  return (
    <BottomBar data-testid="bottombar">
      {shouldShowCanvasNavigation ? (
        <NavigationBar>
          <CanvasNavButton link={previousCanvasLink} direction="previous" />

          <span
            className={typography('body', 'md', 'regular')}
            style={{ color: 'white' }}
          >
            {canvas}/{totalCanvases}
          </span>

          <CanvasNavButton link={nextCanvasLink} direction="next" />
        </NavigationBar>
      ) : (
        <>
          <LeftZone>
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

          {shouldShowFullscreenButton && (
            <RightZone>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <Space $h={{ size: 'sm', properties: ['margin-right'] }}>
                  <ViewerButton
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
                    $isDark
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
