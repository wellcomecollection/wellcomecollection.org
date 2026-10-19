import { useEffect, useRef, useState } from 'react';

import { getCatalogueLicenseData } from '@weco/common/utils/licenses';
import { fetchIIIFPresentationManifest } from '@weco/content/services/iiif/fetch/manifest';
import { transformManifest } from '@weco/content/services/iiif/transformers/manifest';
import { Image, Work } from '@weco/content/services/wellcome/catalogue/types';
import { getWorkClientSide } from '@weco/content/services/wellcome/catalogue/works';
import {
  getDigitalLocationOfType,
  getProductionDates,
} from '@weco/content/utils/works';
import { toWorksImagesLink } from '@weco/content/views/components/ImageLink';
import { toWorksItemLink } from '@weco/content/views/components/ItemLink';

/**
 * Fetches the full work behind an expanded image and works out what the
 * modal and the sidebar both show about it: its metadata, licence and the
 * link to view it.
 */
const useImageDetails = (images: Image[], expandedImage?: Image) => {
  const [detailedWork, setDetailedWork] = useState<Work | undefined>();
  const [canvasDeeplink, setCanvasDeeplink] = useState<
    | {
        canvas: number;
      }
    | undefined
  >();
  const [currentImageId, setCurrentImageId] = useState<string | undefined>();
  const latestWorkId = useRef<string | undefined>(undefined);

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
      setCanvasDeeplink(undefined);
      setCurrentImageId(workId);
      latestWorkId.current = workId;

      // Fetch new information
      const fetchDetailedWork = async () => {
        const res = await getWorkClientSide(workId);
        // Another image may have been selected while this was loading
        if (latestWorkId.current === workId && res.type === 'Work') {
          setDetailedWork(res);
        }
      };
      fetchDetailedWork();
    }
  }, [workId, currentImageId]);

  useEffect(() => {
    const requestedWorkId = workId;

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
      // Another image may have been selected while the manifest was loading
      if (
        latestWorkId.current === requestedWorkId &&
        canvasIndex &&
        canvasIndex !== -1
      ) {
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

  return {
    detailedWork,
    iiifImageLocation,
    license,
    expandedImageLink,
    productionDates,
    displayContributor,
    displayTitle,
  };
};

export default useImageDetails;
