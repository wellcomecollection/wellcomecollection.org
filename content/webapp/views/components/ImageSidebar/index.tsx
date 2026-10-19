import { Dispatch, FunctionComponent, SetStateAction } from 'react';

import { cross } from '@weco/common/icons';
import Icon from '@weco/common/views/components/Icon';
import { Image } from '@weco/content/services/wellcome/catalogue/types';
import { removeDisplayMarkupTags } from '@weco/content/utils/string';

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
      <h2 id="image-sidebar-title">
        {removeDisplayMarkupTags(expandedImage.source.title)}
      </h2>
    </SidebarWrapper>
  );
};

export default ImageSidebar;
