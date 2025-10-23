// eslint-data-component: intentionally omitted
import {
  Dispatch,
  FunctionComponent,
  SetStateAction,
  useEffect,
  useState,
} from 'react';

import { eye } from '@weco/common/icons';
import { getCatalogueLicenseData } from '@weco/common/utils/licenses';
import Button from '@weco/common/views/components/Buttons';
import Modal from '@weco/common/views/components/Modal';
import LL from '@weco/common/views/components/styled/LL';
import Space from '@weco/common/views/components/styled/Space';
import { fetchIIIFPresentationManifest } from '@weco/content/services/iiif/fetch/manifest';
import { transformManifest } from '@weco/content/services/iiif/transformers/manifest';
import { Image, Work } from '@weco/content/services/wellcome/catalogue/types';
import { getWorkClientSide } from '@weco/content/services/wellcome/catalogue/works';
import {
  getDigitalLocationOfType,
  getProductionDates,
} from '@weco/content/utils/works';
import IIIFImage from '@weco/content/views/components/IIIFImage';
import { toWorksImagesLink } from '@weco/content/views/components/ImageLink';
import { toWorksItemLink } from '@weco/content/views/components/ItemLink';

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
import VisuallySimilarImagesFromApi from './ImageModal.VisuallySimilarImages';
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
  const [detailedWork, setDetailedWork] = useState<Work | undefined>();
  const [canvasDeeplink, setCanvasDeeplink] = useState<
    | {
        canvas: number;
      }
    | undefined
  >();
  const [currentImageId, setCurrentImageId] = useState<string | undefined>();

  const isActive = expandedImage !== undefined;

  // In the case that the modal changes the expanded image to
  // be one that isn't on this results page, this index will be -1
  const resultPosition = images.findIndex(
    img => expandedImage && img.id === expandedImage.id
  );

  const workId = expandedImage?.source.id;

  useEffect(() => {
    if (workId && workId !== currentImageId) {
      // Reset information if new image ID
      setDetailedWork(undefined);
      setCurrentImageId(workId);

      // Fetch new information
      const fetchDetailedWork = async () => {
        const res = await getWorkClientSide(workId);
        if (res.type === 'Work') {
          setDetailedWork(res);
        }
      };
      fetchDetailedWork();
    }
  }, [workId, currentImageId]);

  useEffect(() => {
    // This downloads the IIIF manifest and tries to find the image in the canvases.
    // With upcoming work on IIIF identifiers, we should be able to provide the
    // deep link information from the API directly, but for now this is a
    // pragmatic - if ugly - solution.
    const fetchDeeplinkCanvasIndex = async (
      manifestLocation: string,
      imageUrl: string
    ) => {
      const imageLocationBase = imageUrl.replace('/info.json', '');
      const iiifManifest = await fetchIIIFPresentationManifest({
        location: manifestLocation,
      });
      const transformedManifest =
        iiifManifest && transformManifest(iiifManifest);
      const { firstCollectionManifestLocation, canvases } = {
        ...transformedManifest,
      };

      if (firstCollectionManifestLocation) {
        return fetchDeeplinkCanvasIndex(
          firstCollectionManifestLocation,
          imageUrl
        );
      }

      const canvasIndex = canvases?.findIndex(canvas => {
        const { imageServiceId } = canvas;
        return (
          imageServiceId && imageServiceId.indexOf(imageLocationBase) !== -1
        );
      });
      if (canvasIndex && canvasIndex !== -1) {
        setCanvasDeeplink({
          canvas: canvasIndex + 1,
        });
      }
    };
    if (detailedWork) {
      const manifestLocation = getDigitalLocationOfType(
        detailedWork,
        'iiif-presentation'
      );
      if (manifestLocation) {
        fetchDeeplinkCanvasIndex(
          manifestLocation.url,
          expandedImage?.locations[0]?.url || ''
        );
      }
    }
  }, [detailedWork]);

  useEffect(() => {
    document?.documentElement?.classList.add('is-scroll-locked');

    return () => {
      document?.documentElement?.classList.remove('is-scroll-locked');
    };
  }, []);

  const iiifImageLocation = expandedImage?.locations[0];
  const license =
    iiifImageLocation?.license &&
    getCatalogueLicenseData(iiifImageLocation.license);

  const expandedImageLink =
    expandedImage && !canvasDeeplink
      ? toWorksImagesLink({
          workId,
          id: expandedImage.id,
          resultPosition,
        })
      : detailedWork &&
        workId &&
        toWorksItemLink({
          workId,
          props: { resultPosition, ...(canvasDeeplink || {}) },
        });

  const productionDates = detailedWork ? getProductionDates(detailedWork) : [];
  const displayContributor = detailedWork?.contributors?.[0]?.agent?.label;
  const displayTitle = detailedWork?.title ?? '';

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
                <Space $v={{ size: 'l', properties: ['margin-bottom'] }}>
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
