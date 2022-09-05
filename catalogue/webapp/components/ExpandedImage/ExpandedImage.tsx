import {
  getCanvases,
  getFirstChildManifestLocation,
  getServiceId,
} from '../../utils/iiif';
import NextLink from 'next/link';
import { font, classNames } from '@weco/common/utils/classnames';
import {
  getDigitalLocationOfType,
  sierraIdFromPresentationManifestUrl,
} from '../../utils/works';
import { getCatalogueLicenseData } from '@weco/common/utils/licenses';
import ButtonSolidLink from '@weco/common/views/components/ButtonSolidLink/ButtonSolidLink';
import License from '../License/License';
import { Image as ImageType, Work } from '@weco/common/model/catalogue';
import { getWorkClientSide } from '../../services/catalogue/works';
import { useEffect, useState, FunctionComponent } from 'react';
import styled from 'styled-components';
import Space from '@weco/common/views/components/styled/Space';
import VisuallySimilarImagesFromApi from '../VisuallySimilarImagesFromApi/VisuallySimilarImagesFromApi';
import WorkLink from '@weco/common/views/components/WorkLink/WorkLink';
import { expandedViewImageButton } from '@weco/common/text/aria-labels';
import { toLink as itemLink } from '@weco/common/views/components/ItemLink/ItemLink';
import { toLink as imageLink } from '@weco/common/views/components/ImageLink/ImageLink';
import { eye } from '@weco/common/icons';
import IIIFImage from '../IIIFImage/IIIFImage';

type Props = {
  image: ImageType | undefined;
  setExpandedImage: (image?: ImageType) => void;
  resultPosition: number;
};

type CanvasLink = {
  canvas: number;
  sierraId: string;
};

const ImageWrapper = styled(Space).attrs({
  v: { size: 'm', properties: ['margin-bottom'] },
})`
  ${props => props.theme.media.medium`
    flex-basis: 40%;
    order: 2;
    height: auto;
  `}
`;

const ImageLink = styled.a`
  position: relative;
  display: block;
  width: 100%;
  max-width: 400px;
  margin: auto;

  img {
    max-width: 100%;
  }
`;

const InfoWrapper = styled.div`
  ${props => props.theme.media.medium`
    flex-basis: 60%;
    padding-right: 20px;
    order: 1;
    height: 100%;
  `}
`;

const ExpandedImageContainer = styled.div`
  ${props => props.theme.media.medium`
    overflow: auto;
    display: flex;
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

  const workId = image?.source.id;
  const displayTitle = detailedWork?.title ?? '';
  const displayContributor = detailedWork?.contributors?.[0]?.agent?.label;

  useEffect(() => {
    if (workId) {
      const fetchDetailedWork = async () => {
        const res = await getWorkClientSide(workId);
        if (res.type === 'Work') {
          setDetailedWork(res);
        }
      };
      fetchDetailedWork();
    }
  }, [workId]);

  useEffect(() => {
    // This downloads the IIIF manifest and tries to find the image in the canvases.
    // With upcoming work on IIIF identifiers, we should be able to provide the
    // deep link information from the API directly, but for now this is a
    // pragmatic - if ugly - solution.
    const fetchDeeplinkCanvasIndex = async (
      manifestLocation: string,
      imageUrl: string
    ) => {
      const res = await fetch(manifestLocation);
      const manifest = await res.json();
      const firstChildManifestLocation =
        getFirstChildManifestLocation(manifest);
      if (firstChildManifestLocation) {
        return fetchDeeplinkCanvasIndex(firstChildManifestLocation, imageUrl);
      }
      const canvases = getCanvases(manifest);
      const imageLocationBase = imageUrl.replace('/info.json', '');
      const canvasIndex = canvases.findIndex(canvas => {
        const serviceId = getServiceId(canvas);
        return serviceId && serviceId.indexOf(imageLocationBase) !== -1;
      });
      const sierraId = sierraIdFromPresentationManifestUrl(manifestLocation);
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
            resultPosition: resultPosition,
            ...(canvasDeeplink || {}),
          },
          trackingSource
        );

  return (
    <ExpandedImageContainer>
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
              />
            </ImageLink>
          </NextLink>
        </ImageWrapper>
      )}
      <InfoWrapper>
        <Space v={{ size: 'l', properties: ['margin-bottom'] }}>
          <h2
            className={classNames({
              [font('intb', 3)]: true,
              'no-margin': true,
            })}
            dangerouslySetInnerHTML={{ __html: displayTitle }}
          />
          {displayContributor && (
            <Space
              as="h3"
              v={{ size: 's', properties: ['margin-top'] }}
              className={classNames({ [font('intb', 5)]: true })}
            >
              {displayContributor}
            </Space>
          )}
        </Space>
        {license && (
          <Space
            className={font('intr', 5)}
            v={{ size: 'l', properties: ['margin-bottom'] }}
          >
            <License license={license} />
          </Space>
        )}

        <Space v={{ size: 'xl', properties: ['margin-bottom'] }}>
          {expandedImageLink && (
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
          )}
          {workId && (
            <WorkLink
              id={workId}
              source={trackingSource}
              resultPosition={resultPosition}
            >
              <a
                className={classNames({
                  'inline-block': true,
                  [font('intr', 5)]: true,
                })}
              >
                More about this work
              </a>
            </WorkLink>
          )}
        </Space>
        {image?.id && (
          <VisuallySimilarImagesFromApi
            originalId={image?.id}
            onClickImage={setExpandedImage}
          />
        )}
      </InfoWrapper>
    </ExpandedImageContainer>
  );
};

export default ExpandedImage;
