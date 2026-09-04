import { ChoiceBody, ImageService } from '@iiif/presentation-3';
import { useMemo } from 'react';

import { DigitalLocation } from '@weco/common/model/catalogue';
import { useItemViewerContext } from '@weco/content/contexts/ItemViewerContext/refactored';
import { DownloadOption } from '@weco/content/types/manifest';
import {
  deduplicateDownloadOptions,
  getDownloadOptionsFromCanvasRenderingAndSupplementing,
  getDownloadOptionsFromManifestRendering,
  getImageServiceFromItem,
  getVideoAudioDownloadOptions,
  isChoiceBody,
} from '@weco/content/utils/iiif/v3';
import { getDownloadOptionsFromImageUrl } from '@weco/content/utils/works';

import useTransformedIIIFImage from './useTransformedIIIFImage';

/**
 * Works can have a DigitalLocation of type iiif-presentation and/or
 * iiif-image. For a iiif-presentation DigitalLocation we get the download
 * options from the manifest to which it points. For a iiif-image
 * DigitalLocation we create the download options from a combination of the
 * DigitalLocation and the iiif-image json to which it points - the json
 * provides the image width and height used in the link text, fetched client
 * side via useTransformedIIIFImage since it isn't vital to rendering the
 * links. Sometimes we render images for works that have neither location
 * type - iiifImageLocation covers that case, passed from the /images.tsx
 * page's getServerSideProps.
 */
export function useDownloadOptions(
  iiifImageLocation?: DigitalLocation
): DownloadOption[] {
  const { work, currentCanvas, transformedManifest } = useItemViewerContext();
  const transformedIIIFImage = useTransformedIIIFImage(work);
  const { rendering } = { ...transformedManifest };

  return useMemo(() => {
    const imageServices = (currentCanvas?.painting
      .map(p => {
        if (isChoiceBody(p)) {
          return p.items.map(item =>
            getImageServiceFromItem(item as unknown as ChoiceBody)
          );
        } else {
          return getImageServiceFromItem(p);
        }
      })
      .flat()
      .filter(Boolean) || []) as ImageService[];

    const iiifImageDownloadOptions = iiifImageLocation
      ? getDownloadOptionsFromImageUrl({
          url: iiifImageLocation.url,
          width: transformedIIIFImage.width,
          height: transformedIIIFImage.height,
        })
      : [];

    // We also want to offer download options for each canvas image
    // in the iiif-presentation manifest when it is being viewed.
    const canvasImageDownloads = imageServices
      .map(imageService => {
        if (imageService['@id']) {
          return getDownloadOptionsFromImageUrl({
            url: imageService['@id'],
            width: imageService.width || undefined,
            height: imageService.height || undefined,
          });
        } else {
          return [];
        }
      })
      .flat()
      .filter(Boolean);

    const canvasDownloadOptions = currentCanvas
      ? getDownloadOptionsFromCanvasRenderingAndSupplementing(currentCanvas)
      : [];

    const manifestDownloadOptions =
      getDownloadOptionsFromManifestRendering(rendering);

    const videoAudioDownloadOptions =
      getVideoAudioDownloadOptions(currentCanvas);

    // We need multiple sources for downloads to cover the different
    // ways in which a download can be made available in a iiif manifest.
    // The same file can appear in multiple sources, so we deduplicate by id.
    return deduplicateDownloadOptions([
      ...iiifImageDownloadOptions,
      ...canvasImageDownloads,
      ...canvasDownloadOptions,
      ...manifestDownloadOptions,
      ...videoAudioDownloadOptions,
    ]);
  }, [
    currentCanvas,
    rendering,
    iiifImageLocation,
    transformedIIIFImage.width,
    transformedIIIFImage.height,
  ]);
}

export default useDownloadOptions;
