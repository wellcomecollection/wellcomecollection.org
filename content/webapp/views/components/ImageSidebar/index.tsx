import { Dispatch, FunctionComponent, SetStateAction } from 'react';

import { cross, eye } from '@weco/common/icons';
import Button from '@weco/common/views/components/Buttons';
import Icon from '@weco/common/views/components/Icon';
import LL from '@weco/common/views/components/styled/LL';
import Space from '@weco/common/views/components/styled/Space';
import { Image } from '@weco/content/services/wellcome/catalogue/types';
import IIIFImage from '@weco/content/views/components/IIIFImage';
import VisuallySimilarImagesFromApi from '@weco/content/views/components/ImageDetails/ImageDetails.VisuallySimilarImages';
import useImageDetails from '@weco/content/views/components/ImageDetails/useImageDetails';

import {
  CloseButton,
  LoadingWrapper,
  Metadata,
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
 * Renders nothing until an image is selected.
 */
const ImageSidebar: FunctionComponent<Props> = ({
  images,
  expandedImage,
  setExpandedImage,
}) => {
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
    >
      <CloseButton onClick={() => setExpandedImage(undefined)}>
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
              <ThumbnailLink {...expandedImageLink}>
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
                    <Metadata>{displayContributor}</Metadata>
                  )}
                  {productionDates.length > 0 && (
                    <Metadata>Date:&nbsp;{productionDates[0]}</Metadata>
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
          />
        </>
      )}
    </SidebarWrapper>
  );
};

export default ImageSidebar;
