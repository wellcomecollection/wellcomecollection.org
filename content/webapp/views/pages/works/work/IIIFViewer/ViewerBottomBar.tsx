import { FunctionComponent } from 'react';
import styled from 'styled-components';

import { useAppContext } from '@weco/common/contexts/AppContext';
import { gridView, singlePage } from '@weco/common/icons';
import { LinkProps } from '@weco/common/model/link-props';
import { typography } from '@weco/common/utils/classnames';
import Space from '@weco/common/views/components/styled/Space';
import { useItemViewerContext } from '@weco/content/contexts/ItemViewerContext';
import useIsFullscreenEnabled from '@weco/content/hooks/useIsFullscreenEnabled';
import { toWorksItemLink } from '@weco/content/views/components/ItemLink';
import PrevNextLink from '@weco/content/views/components/PrevNextLink';

import CanvasPositionIndicator from './CanvasPositionIndicator';
import FullscreenToggleButton from './FullscreenToggleButton';
import ToolbarSegmentedControl from './ToolbarSegmentedControl';

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
  link?: LinkProps;
  direction: 'previous' | 'next';
};

const CanvasNavButton: FunctionComponent<CanvasNavButtonProps> = ({
  link,
  direction,
}) => (
  <PrevNextLink
    direction={direction}
    link={link}
    label={direction === 'previous' ? 'Previous page' : 'Next page'}
    isOnDark
  />
);

const ViewerBottomBar: FunctionComponent = () => {
  const { isEnhanced } = useAppContext();
  const isFullscreenEnabled = useIsFullscreenEnabled();
  const {
    gridVisible,
    setGridVisible,
    showZoomed,
    isMobileSidebarActive,
    showFullscreenControl,
    work,
    query,
    totalCanvases,
    hasMultipleCanvases,
    hasOnlyRenderableImages,
  } = useItemViewerContext();

  const { canvas: canvasNumber } = query;

  const canNavigatePrevious = canvasNumber > 1;
  const canNavigateNext = canvasNumber < totalCanvases;

  const previousCanvasLink = canNavigatePrevious
    ? toWorksItemLink({ workId: work.id, props: { canvas: canvasNumber - 1 } })
    : undefined;
  const nextCanvasLink = canNavigateNext
    ? toWorksItemLink({ workId: work.id, props: { canvas: canvasNumber + 1 } })
    : undefined;

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
            <CanvasPositionIndicator />
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
                  <FullscreenToggleButton />
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
