// @flow
import fetch from 'isomorphic-unfetch';
import { iiifImageTemplate } from '@weco/common/utils/convert-image-uri';
import { Fragment, useEffect, useState } from 'react';

// TODO flow
// Ideal preview thumbnails order: Title page, Front Cover, first page of Table of Contents, 2 random.
// If we don't have any of the sructured pages, we fill with random ones, so there are always 5 images if possible.
function randomImages(iiifManifest = null, structuredImages = [], n = 1) {
  const images = [];
  const canvases = iiifManifest
    ? iiifManifest.sequences
        .find(sequence => sequence['@type'] === 'sc:Sequence')
        .canvases.filter(canvas => {
          // Don't include the structured pages we're using when getting random ones
          return (
            structuredImages
              .map(type => {
                return type.images.find(image => {
                  return canvas['@id'] === image.canvasId;
                });
              })
              .filter(Boolean).length === 0
          );
        })
    : [];

  const numberOfImages = canvases.length < n ? canvases.length : n;

  for (var i = 1; i <= numberOfImages; i++) {
    const randomNumber = Math.floor(Math.random() * canvases.length);
    const randomCanvas = canvases.splice(randomNumber, 1)[0];
    images.push({
      orientation:
        randomCanvas.thumbnail.service.width >
        randomCanvas.thumbnail.service.height
          ? 'landscape'
          : 'portrait',
      uri: iiifImageTemplate(randomCanvas.thumbnail.service['@id'])({
        size: '!400,400',
      }),
      canvasId: randomCanvas['@id'],
    });
  }
  return {
    label: 'random',
    images,
  };
}

function structuredImages(iiifManifest = null) {
  const structures = iiifManifest ? iiifManifest.structures : [];
  return structures.map(structure => {
    const images = structure.canvases.map(canvasId => {
      const matchingCanvas =
        iiifManifest &&
        iiifManifest.sequences
          .find(sequence => sequence['@type'] === 'sc:Sequence')
          .canvases.find(canvas => {
            return canvas['@id'] === canvasId;
          });
      return (
        matchingCanvas && {
          orientation:
            matchingCanvas.thumbnail.service.width >
            matchingCanvas.thumbnail.service.height
              ? 'landscape'
              : 'portrait',
          uri: iiifImageTemplate(matchingCanvas.thumbnail.service['@id'])({
            size: '!400,400',
          }),
          canvasId,
        }
      );
    });
    return {
      label: structure.label,
      images,
    };
  });
}

function orderedStructuredImages(structuredImages) {
  const titlePage = structuredImages.find(
    structuredImage => structuredImage.label === 'Title Page'
  );
  const frontCover = structuredImages.find(
    structuredImage =>
      structuredImage.label === 'Front Cover' ||
      structuredImage.label === 'Cover'
  );
  const firstTableOfContents = structuredImages.find(
    structuredImage => structuredImage.label === 'Table of Contents'
  );
  return [titlePage, frontCover, firstTableOfContents].filter(Boolean);
}

function previewThumbnails(
  iiifManifest = {},
  structuredImages = [],
  idealNumber = 5
) {
  return structuredImages.length < idealNumber
    ? structuredImages.concat(
        randomImages(
          iiifManifest,
          structuredImages,
          idealNumber - structuredImages.length
        )
      )
    : structuredImages;
}

type Props = {|
  iiifPresentationLocation: any, // TODO
|};

const IIIFPresentationDisplay = ({ iiifPresentationLocation }: Props) => {
  const [imageThumbnails, setImageThumbnails] = useState(false);
  const fetchThumbnails = async () => {
    try {
      const iiifManifest = await fetch(iiifPresentationLocation.url);
      const manifestData = await iiifManifest.json();
      setImageThumbnails(
        previewThumbnails(
          manifestData,
          orderedStructuredImages(structuredImages(manifestData)),
          5
        )
      );
    } catch (e) {}
  };
  useEffect(() => {
    fetchThumbnails();
  }, []);

  return (
    <Fragment>
      {imageThumbnails &&
        imageThumbnails.map(pageType => {
          return pageType.images.map(image => (
            <img
              style={{ width: 'auto', maxHeight: '300px' }}
              key={image.uri}
              src={image.uri}
            />
          ));
        })}
    </Fragment>
  );
};

export default IIIFPresentationDisplay;
// TODO image alt - how do we handle this - no need images are just presentational now, so add correct aria
// TODO import IIIFBookPreview? and use that or delete it?
// TODO layout / styling
