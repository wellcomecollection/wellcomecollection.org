import { Dispatch, FunctionComponent, SetStateAction, useEffect } from 'react';

import { cross } from '@weco/common/icons';
import Icon from '@weco/common/views/components/Icon';
import { Image } from '@weco/content/services/wellcome/catalogue/types';

import { CloseButton, SidebarWrapper } from './ImageSidebar.styles';

type Props = {
  expandedImage?: Image;
  setExpandedImage: Dispatch<SetStateAction<Image | undefined>>;
};

/**
 * Shows the details of the selected image result next to the results grid.
 * Renders nothing until an image is selected.
 */
const ImageSidebar: FunctionComponent<Props> = ({
  expandedImage,
  setExpandedImage,
}) => {
  const isActive = expandedImage !== undefined;

  useEffect(() => {
    if (!isActive) return;

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setExpandedImage(undefined);
    };
    document.addEventListener('keydown', closeOnEscape);
    return () => document.removeEventListener('keydown', closeOnEscape);
  }, [isActive]);

  if (!expandedImage) return null;

  return (
    <SidebarWrapper
      as="section"
      data-component="image-sidebar"
      aria-labelledby="image-sidebar-title"
    >
      <CloseButton onClick={() => setExpandedImage(undefined)}>
        <span className="visually-hidden">Close image details</span>
        <Icon icon={cross} />
      </CloseButton>
      <h2 id="image-sidebar-title">{expandedImage.source.title}</h2>
    </SidebarWrapper>
  );
};

export default ImageSidebar;
