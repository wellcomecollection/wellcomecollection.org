// https://stackoverflow.com/questions/25993861/how-do-i-get-typescript-to-stop-complaining-about-functions-it-doesnt-know-abou
/* eslint-disable dot-notation */
import { FunctionComponent } from 'react';
import styled from 'styled-components';

import { useAppContext } from '@weco/common/contexts/AppContext';
import { gridView, maximise, singlePage } from '@weco/common/icons';
import Icon from '@weco/common/views/components/Icon';
import Space from '@weco/common/views/components/styled/Space';
import { useItemViewerContext } from '@weco/content/contexts/ItemViewerContext';
import useIsFullscreenEnabled from '@weco/content/hooks/useIsFullscreenEnabled';

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

const LeftZone = styled(Space).attrs({
  $v: { size: '2xs', properties: ['padding-top', 'padding-bottom'] },
  $h: { size: 'sm', properties: ['padding-left'] },
})`
  display: flex;
  justify-content: flex-start;
  align-items: center;
`;

const RightZone = styled(Space).attrs({
  $v: { size: '2xs', properties: ['padding-top', 'padding-bottom'] },
})`
  display: flex;
  justify-content: flex-end;
  align-items: center;
`;

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
  } = useItemViewerContext();

  const { canvases } = { ...transformedManifest };

  return (
    <BottomBar>
      <LeftZone>
        {!showZoomed &&
          canvases &&
          canvases.length > 1 &&
          !isMobileSidebarActive && (
            <ToolbarSegmentedControl
              hideLabels={true}
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
            />
          )}
      </LeftZone>

      {isEnhanced && isFullscreenEnabled && showFullscreenControl && (
        <RightZone>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Space $h={{ size: 'sm', properties: ['margin-right'] }}>
              <ViewerButton
                $isDark
                onClick={() => {
                  if (viewerRef?.current) {
                    if (
                      !document.fullscreenElement &&
                      !document['webkitFullscreenElement']
                    ) {
                      if (viewerRef.current.requestFullscreen) {
                        viewerRef.current.requestFullscreen();
                      } else if (viewerRef.current['webkitRequestFullscreen']) {
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
                <Icon icon={maximise} />
                <span style={{ marginLeft: '7px' }}>Full screen</span>
              </ViewerButton>
            </Space>
          </div>
        </RightZone>
      )}
    </BottomBar>
  );
};

export default ViewerBottomBar;
