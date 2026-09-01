import { FunctionComponent } from 'react';

import { maximise, minimise } from '@weco/common/icons';
import Icon from '@weco/common/views/components/Icon';
import { useItemViewerContext } from '@weco/content/contexts/ItemViewerContext/refactored';
import useFullscreenToggle from '@weco/content/hooks/useFullscreenToggle';

import { ViewerButton } from './ViewerButton.styles';

type Props = {
  className?: string;
};

const FullscreenToggleButton: FunctionComponent<Props> = ({ className }) => {
  const { viewerRef, isFullscreen, setIsFullscreen } = useItemViewerContext();
  const toggleFullscreen = useFullscreenToggle({ viewerRef, setIsFullscreen });

  return (
    <ViewerButton className={className} $isDark onClick={toggleFullscreen}>
      {isFullscreen ? (
        <>
          <Icon icon={minimise} />
          <span style={{ marginLeft: '7px' }}>Exit full screen</span>
        </>
      ) : (
        <>
          <Icon icon={maximise} />
          <span style={{ marginLeft: '7px' }}>Full screen</span>
        </>
      )}
    </ViewerButton>
  );
};

export default FullscreenToggleButton;
