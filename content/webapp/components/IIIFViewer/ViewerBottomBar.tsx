// https://stackoverflow.com/questions/25993861/how-do-i-get-typescript-to-stop-complaining-about-functions-it-doesnt-know-abou
/* eslint-disable dot-notation */
import { FunctionComponent, useContext } from 'react';
import styled from 'styled-components';

import { gridView, maximise, singlePage } from '@weco/common/icons';
import { AppContext } from '@weco/common/views/components/AppContext';
import Icon from '@weco/common/views/components/Icon';
import Space from '@weco/common/views/components/styled/Space';
import ItemViewerContext from '@weco/content/components/ItemViewerContext';
import ToolbarSegmentedControl from '@weco/content/components/ToolbarSegmentedControl';
import useIsFullscreenEnabled from '@weco/content/hooks/useIsFullscreenEnabled';

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
  $v: { size: 's', properties: ['padding-top', 'padding-bottom'] },
  $h: { size: 'm', properties: ['padding-left'] },
})`
  display: flex;
  justify-content: flex-start;
  align-items: center;
`;

const RightZone = styled(Space).attrs({
  $v: { size: 's', properties: ['padding-top', 'padding-bottom'] },
})`
  display: flex;
  justify-content: flex-end;
  align-items: center;
`;

const ViewerBottomBar: FunctionComponent = () => {
  const { isEnhanced } = useContext(AppContext);
  const isFullscreenEnabled = useIsFullscreenEnabled();

  const {
    transformedManifest,
    gridVisible,
    setGridVisible,
    showZoomed,
    isMobileSidebarActive,
    viewerRef,
  } = useContext(ItemViewerContext);
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

      <RightZone>
        {isEnhanced && isFullscreenEnabled && (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Space $h={{ size: 'm', properties: ['margin-right'] }}>
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
        )}
      </RightZone>
    </BottomBar>
  );
};

export default ViewerBottomBar;
