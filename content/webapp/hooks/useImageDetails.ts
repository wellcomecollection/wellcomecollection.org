import { useEffect, useState } from 'react';

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
 * Downloads the IIIF manifest and tries to find the image in its canvases,
 * returning the canvas's index, or undefined/-1 if it isn't there.
 * With upcoming work on IIIF identifiers, we should be able to provide the
 * deep link information from the API directly, but for now this is a
 * pragmatic solution.
 */
const fetchDeeplinkCanvasIndex = async (
  manifestLocation: string,
  imageUrl: string
): Promise<number | undefined> => {
  const imageLocationBase = imageUrl.replace('/info.json', '');
  const iiifManifest = await fetchIIIFPresentationManifest({
    location: manifestLocation,
  });
  const transformedManifest = iiifManifest && transformManifest(iiifManifest);
  const { firstCollectionManifestLocation, canvases } = {
    ...transformedManifest,
  };

  if (firstCollectionManifestLocation) {
    return fetchDeeplinkCanvasIndex(firstCollectionManifestLocation, imageUrl);
  }

  return canvases?.findIndex(canvas => {
    const { imageServiceId } = canvas;
    return imageServiceId && imageServiceId.indexOf(imageLocationBase) !== -1;
  });
};

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

  // In the case that the modal changes the expanded image to
  // be one that isn't on this results page, this index will be -1
  const resultPosition = images.findIndex(
    img => expandedImage && img.id === expandedImage.id
  );

  const workId = expandedImage?.source.id;
  const imageUrl = expandedImage?.locations[0]?.url;

  // The work is fetched per work, and dropped (with any request still in
  // flight) when another is selected or the image is closed.
  useEffect(() => {
    setDetailedWork(undefined);
    if (!workId) return;

    let cancelled = false;
    getWorkClientSide(workId).then(res => {
      if (!cancelled && res.type === 'Work') setDetailedWork(res);
    });
    return () => {
      cancelled = true;
    };
  }, [workId]);

  // The canvas is looked up per image, as several images can share a work.
  useEffect(() => {
    setCanvasDeeplink(undefined);
    // detailedWork is still the previous work for a render after another is selected
    const manifestLocation =
      detailedWork && detailedWork.id === workId
        ? getDigitalLocationOfType(detailedWork, 'iiif-presentation')
        : undefined;
    if (!manifestLocation || !imageUrl) return;

    let cancelled = false;
    fetchDeeplinkCanvasIndex(manifestLocation.url, imageUrl).then(
      canvasIndex => {
        // The first canvas (index 0) isn't deeplinked, see #13693
        if (!cancelled && canvasIndex && canvasIndex !== -1) {
          setCanvasDeeplink({ canvas: canvasIndex + 1 });
        }
      }
    );
    return () => {
      cancelled = true;
    };
  }, [detailedWork, imageUrl, workId]);

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
