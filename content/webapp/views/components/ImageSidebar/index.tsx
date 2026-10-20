import {
  Dispatch,
  FunctionComponent,
  SetStateAction,
  useEffect,
  useRef,
} from 'react';

import { useAppContext } from '@weco/common/contexts/AppContext';
import { cross, eye } from '@weco/common/icons';
import Button from '@weco/common/views/components/Buttons';
import Icon from '@weco/common/views/components/Icon';
import LL from '@weco/common/views/components/styled/LL';
import PipeSeparated from '@weco/common/views/components/styled/PipeSeparated';
import Space from '@weco/common/views/components/styled/Space';
import useImageDetails from '@weco/content/hooks/useImageDetails';
import { Image } from '@weco/content/services/wellcome/catalogue/types';
import { removeDisplayMarkupTags } from '@weco/content/utils/string';
import IIIFImage from '@weco/content/views/components/IIIFImage';
import VisuallySimilarImagesFromApi from '@weco/content/views/components/VisuallySimilarImages';

import {
  CloseButton,
  LoadingWrapper,
  MetadataWrapper,
  SidebarWrapper,
  ThumbnailLink,
  ThumbnailPanel,
  Title,
} from './ImageSidebar.styles';

type Props = {
  images: Image[];
  expandedImage?: Image;
  setExpandedImage: Dispatch<SetStateAction<Image | undefined>>;
};

/**
 * Shows the details of the selected image result next to the results grid.
 * Renders nothing until an image is selected. Focus moves to the close button
 * as it opens, but not when another image is selected while it's open.
 */
const ImageSidebar: FunctionComponent<Props> = ({
  images,
  expandedImage,
  setExpandedImage,
}) => {
  // A button, rendered with `as` from a styled div
  const closeButtonRef = useRef<HTMLDivElement>(null);
  const isOpen = expandedImage !== undefined;
  const { windowSize } = useAppContext();

  useEffect(() => {
    if (!isOpen) return;

    // Setting the image id as the URL hash makes the browser focus the
    // thumbnail with that id, so wait until that has happened.
    const timeout = setTimeout(() => closeButtonRef.current?.focus());
    return () => clearTimeout(timeout);
  }, [isOpen]);

  const {
    detailedWork,
    iiifImageLocation,
    license,
    expandedImageLink,
    productionDates,
    displayContributor,
    displayTitle,
  } = useImageDetails(images, expandedImage);

  if (!expandedImage) return null;

  return (
    <SidebarWrapper
      as="section"
      data-component="image-sidebar"
      aria-label="Image details"
      // Full screen below `sm`. This uses the window's width, not a media
      // query: locking hides the page scrollbar, which can change the width a
      // media query sees and flip the layout back and forth.
      data-lock-scroll={windowSize === 'zero'}
    >
      <CloseButton
        ref={closeButtonRef}
        onClick={() => setExpandedImage(undefined)}
      >
        <span className="visually-hidden">Close image details</span>
        <Icon icon={cross} />
      </CloseButton>

      {!detailedWork ? (
        <LoadingWrapper>
          <LL />
        </LoadingWrapper>
      ) : (
        <>
          {iiifImageLocation && expandedImageLink && (
            <ThumbnailPanel>
              <ThumbnailLink
                {...expandedImageLink}
                aria-label={
                  displayTitle
                    ? `View image: ${removeDisplayMarkupTags(displayTitle)}`
                    : 'View image'
                }
              >
                <IIIFImage
                  layout="raw"
                  image={{
                    contentUrl: iiifImageLocation.url,
                    width: 400,
                    height: 400,
                    alt: '',
                  }}
                  width={400}
                />
              </ThumbnailLink>
            </ThumbnailPanel>
          )}

          {(displayTitle || displayContributor || license) && (
            <Space $v={{ size: 'md', properties: ['margin-bottom'] }}>
              {displayTitle && (
                <Title dangerouslySetInnerHTML={{ __html: displayTitle }} />
              )}

              {(displayContributor || productionDates.length > 0) && (
                <MetadataWrapper>
                  {displayContributor && (
                    <PipeSeparated>{displayContributor}</PipeSeparated>
                  )}
                  {productionDates.length > 0 && (
                    <PipeSeparated>
                      Date:&nbsp;{productionDates[0]}
                    </PipeSeparated>
                  )}
                </MetadataWrapper>
              )}

              {license && (
                <MetadataWrapper>
                  Licence:&nbsp;
                  {license.url && (
                    <a rel="license" href={license.url}>
                      {license.label}
                    </a>
                  )}
                  {!license.url && license.label}
                </MetadataWrapper>
              )}
            </Space>
          )}

          {expandedImageLink && (
            <Space $v={{ size: 'md', properties: ['margin-bottom'] }}>
              <Button
                variant="ButtonSolidLink"
                text="View image"
                icon={eye}
                link={expandedImageLink}
                ariaLabel="View expanded image"
              />
            </Space>
          )}

          <VisuallySimilarImagesFromApi
            originalId={expandedImage.id}
            onClickImage={setExpandedImage}
            variant="sidebar"
          />
        </>
      )}
    </SidebarWrapper>
  );
};

export default ImageSidebar;
