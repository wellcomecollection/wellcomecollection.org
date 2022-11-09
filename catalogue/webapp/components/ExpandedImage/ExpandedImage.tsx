import { useEffect, useState, FunctionComponent } from 'react';
import styled from 'styled-components';
import NextLink from 'next/link';

import { getServiceId } from '@weco/catalogue/utils/iiif/v2';
import { font } from '@weco/common/utils/classnames';
import {
  getDigitalLocationOfType,
  sierraIdFromPresentationManifestUrl,
} from '@weco/catalogue/utils/works';
import { getCatalogueLicenseData } from '@weco/common/utils/licenses';
import { Image as ImageType, Work } from '@weco/common/model/catalogue';
import { getWorkClientSide } from '@weco/catalogue/services/catalogue/works';
import { expandedViewImageButton } from '@weco/common/text/aria-labels';
import { fetchIIIFPresentationManifest } from '@weco/catalogue/services/iiif/fetch/manifest';
import { transformManifest } from '@weco/catalogue/services/iiif/transformers/manifest';

import { eye } from '@weco/common/icons';
import Space from '@weco/common/views/components/styled/Space';
import ButtonSolidLink from '@weco/common/views/components/ButtonSolidLink/ButtonSolidLink';
import VisuallySimilarImagesFromApi from '@weco/catalogue/components/VisuallySimilarImagesFromApi/VisuallySimilarImagesFromApi';
import IIIFImage from '@weco/catalogue/components/IIIFImage/IIIFImage';
import LL from '@weco/common/views/components/styled/LL';
import { toLink as itemLink } from '@weco/common/views/components/ItemLink/ItemLink';
import { toLink as imageLink } from '@weco/common/views/components/ImageLink/ImageLink';
import { getProductionDates } from '../../utils/works';

type Props = {
  image: ImageType | undefined;
  setExpandedImage: (image?: ImageType) => void;
  resultPosition: number;
};

type CanvasLink = {
  canvas: number;
  sierraId: string;
};

const ImageInfoWrapper = styled.div`
  ${props => props.theme.media('large')`
    display: flex;
  `}
`;

const MetadataWrapper = styled(Space).attrs({
  v: { size: 's', properties: ['margin-top', 'margin-bottom'] },
  className: font('intr', 5),
})`
  color: ${props => props.theme.color('neutral.600')};
`;

const Metadata = styled.span`
  &:not(:first-child)::before {
    content: ' | ';
    margin: 0 4px;
  }
`;

const ImageWrapper = styled(Space).attrs({
  v: { size: 'l', properties: ['margin-bottom'] },
})`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${props => props.theme.color('black')};
  height: 50vh;

  ${props => props.theme.media('large')`
    flex: 0 1 auto;
    height: auto;
    max-height: 350px;
    margin-right: 30px;
  `};
`;

const ImageLink = styled.a`
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  padding: 10px;
  height: 100%;

  img {
    max-width: calc(100% - 20px);
    max-height: 100%;
  }

  ${props => props.theme.media('large')`
    padding: 0;
    max-width: 400px;
    height: calc(100% - 20px);
    width: 100%;
    margin: auto;

    img {
      width: auto;
    }
  `}
`;

const InfoWrapper = styled.div`
  ${props => props.theme.media('large')`
    flex: 1 0 60%;
    height: 100%;
  `}
`;

const trackingSource = 'images_search_result';

const ExpandedImage: FunctionComponent<Props> = ({
  image,
  setExpandedImage,
  resultPosition,
}: Props) => {
  const [detailedWork, setDetailedWork] = useState<Work | undefined>();
  const [canvasDeeplink, setCanvasDeeplink] = useState<
    CanvasLink | undefined
  >();
  const [currentImageId, setCurrentImageId] = useState<string | undefined>();

  const workId = image?.source.id;

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
      const sierraId = sierraIdFromPresentationManifestUrl(manifestLocation);
      const iiifManifest = await fetchIIIFPresentationManifest(
        manifestLocation
      );
      const transformedManifest = transformManifest(
        iiifManifest || {
          manifestV2: undefined,
          manifestV3: undefined,
        }
      );
      const { firstCollectionManifestLocation, canvases } = transformedManifest;

      if (firstCollectionManifestLocation) {
        return fetchDeeplinkCanvasIndex(
          firstCollectionManifestLocation,
          imageUrl
        );
      }
      const canvasIndex = canvases.findIndex(canvas => {
        const serviceId = getServiceId(canvas);
        return serviceId && serviceId.indexOf(imageLocationBase) !== -1;
      });
      if (canvasIndex !== -1) {
        setCanvasDeeplink({
          canvas: canvasIndex + 1,
          sierraId,
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
          image?.locations[0]?.url || ''
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

  const iiifImageLocation = image?.locations[0];
  const license =
    iiifImageLocation?.license &&
    getCatalogueLicenseData(iiifImageLocation.license);

  const expandedImageLink =
    image && !canvasDeeplink
      ? imageLink(
          {
            workId,
            id: image.id,
            resultPosition,
          },
          trackingSource
        )
      : detailedWork &&
        itemLink(
          {
            workId,
            resultPosition,
            ...(canvasDeeplink || {}),
          },
          trackingSource
        );

  if (!detailedWork) {
    return (
      <div style={{ height: '50vh' }}>
        <LL />
      </div>
    );
  }

  const productionDates = getProductionDates(detailedWork);
  const displayContributor = detailedWork?.contributors?.[0]?.agent?.label;
  const displayTitle = detailedWork?.title ?? '';

  return (
    <>
      <ImageInfoWrapper>
        {iiifImageLocation && expandedImageLink && (
          <ImageWrapper>
            <NextLink {...expandedImageLink} passHref>
              <ImageLink>
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
            </NextLink>
          </ImageWrapper>
        )}
        <InfoWrapper>
          {(displayTitle || displayContributor || license) && (
            <Space v={{ size: 'l', properties: ['margin-bottom'] }}>
              {displayTitle && (
                <h2
                  className={`${font('intb', 3)} no-margin`}
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
            <Space v={{ size: 'xl', properties: ['margin-bottom'] }}>
              <Space
                h={{ size: 'm', properties: ['margin-right'] }}
                className="inline-block"
              >
                <ButtonSolidLink
                  text="View image"
                  icon={eye}
                  link={expandedImageLink}
                  ariaLabel={expandedViewImageButton}
                />
              </Space>
            </Space>
          )}
        </InfoWrapper>
      </ImageInfoWrapper>
      {image?.id && (
        <VisuallySimilarImagesFromApi
          originalId={image?.id}
          onClickImage={setExpandedImage}
        />
      )}
    </>
  );
};

export default ExpandedImage;
