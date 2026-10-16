// eslint-data-component: intentionally omitted
import { Dispatch, FunctionComponent, SetStateAction, useEffect } from 'react';

import { eye } from '@weco/common/icons';
import Button from '@weco/common/views/components/Buttons';
import Modal from '@weco/common/views/components/Modal';
import LL from '@weco/common/views/components/styled/LL';
import Space from '@weco/common/views/components/styled/Space';
import useImageDetails from '@weco/content/hooks/useImageDetails';
import { Image } from '@weco/content/services/wellcome/catalogue/types';
import IIIFImage from '@weco/content/views/components/IIIFImage';
import VisuallySimilarImagesFromApi from '@weco/content/views/components/VisuallySimilarImages';

import {
  Container,
  ImageInfoWrapper,
  ImageLink,
  ImageWrapper,
  InfoWrapper,
  Metadata,
  MetadataWrapper,
  ModalTitle,
  ViewImageButtonWrapper,
} from './ImageModal.styles';
import useExpandedImage from './useExpandedImage';

type Props = {
  images: Image[];
  expandedImage?: Image;
  setExpandedImage: Dispatch<SetStateAction<Image | undefined>>;
};

const ImageModal: FunctionComponent<Props> = ({
  images,
  expandedImage,
  setExpandedImage,
}: Props) => {
  const {
    detailedWork,
    iiifImageLocation,
    license,
    expandedImageLink,
    productionDates,
    displayContributor,
    displayTitle,
  } = useImageDetails(images, expandedImage);

  const isActive = expandedImage !== undefined;

  useEffect(() => {
    document?.documentElement?.classList.add('is-scroll-locked');

    return () => {
      document?.documentElement?.classList.remove('is-scroll-locked');
    };
  }, []);

  return (
    <Modal
      id="expanded-image-dialog"
      dataTestId="image-modal"
      isActive={isActive}
      setIsActive={() => setExpandedImage(undefined)}
      maxWidth="1020px"
    >
      {!detailedWork ? (
        <div style={{ height: '50vh' }}>
          <LL />
        </div>
      ) : (
        <Container>
          <ImageInfoWrapper>
            {iiifImageLocation && expandedImageLink && (
              <ImageWrapper>
                <ImageLink {...expandedImageLink}>
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
                </ImageLink>
              </ImageWrapper>
            )}

            <InfoWrapper>
              {(displayTitle || displayContributor || license) && (
                <Space $v={{ size: 'md', properties: ['margin-bottom'] }}>
                  {displayTitle && (
                    <ModalTitle
                      dangerouslySetInnerHTML={{ __html: displayTitle }}
                    />
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
                <Space $v={{ size: 'xl', properties: ['margin-bottom'] }}>
                  <ViewImageButtonWrapper>
                    <Button
                      variant="ButtonSolidLink"
                      text="View image"
                      icon={eye}
                      link={expandedImageLink}
                      ariaLabel="View expanded image"
                    />
                  </ViewImageButtonWrapper>
                </Space>
              )}
            </InfoWrapper>
          </ImageInfoWrapper>

          {expandedImage?.id && (
            <VisuallySimilarImagesFromApi
              originalId={expandedImage?.id}
              onClickImage={setExpandedImage}
            />
          )}
        </Container>
      )}
    </Modal>
  );
};

export default ImageModal;
export { useExpandedImage };
