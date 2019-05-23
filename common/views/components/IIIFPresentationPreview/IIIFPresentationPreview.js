// @flow
import { type IIIFManifest } from '@weco/common/model/iiif';
import {
  type IIIFPresentationLocation,
  getCanvases,
  getManifestViewType,
} from '@weco/common/utils/works';
import NextLink from 'next/link';
import styled from 'styled-components';
import { iiifImageTemplate } from '@weco/common/utils/convert-image-uri';
import { classNames, spacing } from '@weco/common/utils/classnames';
import { useEffect, useState, useContext } from 'react';
import { trackEvent } from '@weco/common/utils/ga';
import ManifestContext from '@weco/common/views/components/ManifestContext/ManifestContext';
import Button from '@weco/common/views/components/Buttons/Button/Button';
import BetaMessage from '@weco/common/views/components/BetaMessage/BetaMessage';
import IIIFResponsiveImage from '@weco/common/views/components/IIIFResponsiveImage/IIIFResponsiveImage';

const PresentationPreview = styled.div`
  overflow: hidden;
  text-align: center;
  position: relative;
  a {
    display: inline-flex;
    align-items: flex-end;
    flex-basis: min-content;
    padding-bottom: ${props => `${props.theme.spacingUnit * 8}px`};
  }
  img {
    display: block;
    max-width: 800px;
    max-height: 400px;
    width: auto;
    margin-left: ${props => `${props.theme.spacingUnit * 5}px`};
  }
  img:first-of-type {
    margin-left: 0;
  }
  .btn--primary {
    position: absolute;
    z-index: 1;
    bottom: 0;
    left: 50%;
    transform: translate(-50%, 50%);
  }
`;

type IIIFThumbnails = {|
  label: string,
  images: {
    id: string,
    canvasId: string,
    width: number,
    height: number,
  }[],
|};

// We want to display the images at 400px high (400px is a size available from the thumbnail service)
// However, we can only use the thumbnail service, with its associated performance benefits, if the image is not landscape.
// When the image is landscape, the image from the thumbnail service has a width of 400px
function appropriateServiceId(canvas) {
  return canvas.width > canvas.height
    ? canvas.images[0].resource.service['@id']
    : canvas.thumbnail.service['@id'];
}

// Ideal preview thumbnails order: Title page, Front Cover, first page of Table of Contents, 2 random.
// If we don't have any of the structured pages, we fill with random ones, so there are up to 5 images if possible.
function randomImages(
  iiifManifest: IIIFManifest,
  structuredImages: IIIFThumbnails[],
  n = 1
): IIIFThumbnails {
  const images = [];
  const canvases = getCanvases(iiifManifest).filter(canvas => {
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
  });

  const numberOfImages = canvases.length < n ? canvases.length : n;

  for (var i = 1; i <= numberOfImages; i++) {
    const randomNumber = Math.floor(Math.random() * canvases.length);
    const randomCanvas = canvases.splice(randomNumber, 1)[0];
    if (randomCanvas.thumbnail.service) {
      images.push({
        id: appropriateServiceId(randomCanvas),
        canvasId: randomCanvas['@id'],
        width: randomCanvas.width,
        height: randomCanvas.height,
      });
    }
  }
  return {
    label: 'random',
    images,
  };
}

function structuredImages(iiifManifest: IIIFManifest): IIIFThumbnails[] {
  return iiifManifest.structures
    ? iiifManifest.structures.map(structure => {
        const images = structure.canvases
          .map(canvasId => {
            const matchingCanvas = getCanvases(iiifManifest).find(canvas => {
              return canvas['@id'] === canvasId;
            });
            if (matchingCanvas) {
              return {
                id: appropriateServiceId(matchingCanvas),
                canvasId: matchingCanvas && matchingCanvas['@id'],
                width: matchingCanvas.width,
                height: matchingCanvas.height,
              };
            }
          })
          .filter(Boolean);
        return {
          label: structure.label,
          images,
        };
      })
    : [];
}

function orderedStructuredImages(
  structuredImages: IIIFThumbnails[]
): IIIFThumbnails[] {
  const titlePage = structuredImages.find(
    structuredImage => structuredImage.label === 'Title Page'
  );
  const frontCover = structuredImages.find(
    structuredImage =>
      structuredImage.label === 'Front Cover' ||
      structuredImage.label === 'Cover'
  );
  const tableOfContents = structuredImages.find(
    structuredImage => structuredImage.label === 'Table of Contents'
  );

  const [firstImage] = tableOfContents ? tableOfContents.images : [];

  return [
    titlePage,
    frontCover,
    tableOfContents && { ...tableOfContents, images: [firstImage] },
  ].filter(Boolean);
}

function previewThumbnails(
  iiifManifest: IIIFManifest,
  structuredImages: IIIFThumbnails[],
  idealNumber: number = 5
): IIIFThumbnails[] {
  return structuredImages.length < idealNumber
    ? structuredImages.concat(
        randomImages(
          iiifManifest,
          structuredImages,
          idealNumber - structuredImages.length
        )
      )
    : structuredImages.slice(0, idealNumber);
}

type Props = {|
  iiifPresentationLocation: IIIFPresentationLocation,
  itemUrl: any,
|};

type ViewType = 'unknown' | 'iiif' | 'pdf' | 'none';
// Can we show the user the work described by the manifest?
// unknown === can't/haven't checked
// iiif | pdf === checked manifest and can render
// none === checked manifest and know we can't render it

const IIIFPresentationDisplay = ({
  iiifPresentationLocation,
  itemUrl,
}: Props) => {
  const [viewType, setViewType] = useState<ViewType>('unknown');
  const [imageThumbnails, setImageThumbnails] = useState([]);
  const [imageTotal, setImageTotal] = useState(0);
  const iiifPresentationManifest = useContext(ManifestContext);

  useEffect(() => {
    if (iiifPresentationManifest) {
      setViewType(getManifestViewType(iiifPresentationManifest));
      setImageTotal(getCanvases(iiifPresentationManifest).length);
      setImageThumbnails(
        previewThumbnails(
          iiifPresentationManifest,
          orderedStructuredImages(structuredImages(iiifPresentationManifest)),
          5
        )
      );
    }
  }, [iiifPresentationManifest]);

  if (viewType === 'unknown' || viewType === 'pdf') {
    return (
      <div
        className={classNames({
          [spacing({ s: 2 }, { margin: ['top', 'bottom'] })]: true,
        })}
      >
        <Button
          type="primary"
          url={`/works/${itemUrl.href.query.workId}/items`}
          trackingEvent={{
            category: 'ViewBookNonJSButton',
            action: 'follow link',
            label: itemUrl.href.query.workId,
          }}
          text="View the item"
          link={itemUrl}
        />
      </div>
    );
  }

  if (viewType === 'iiif') {
    return (
      <PresentationPreview>
        <NextLink {...itemUrl}>
          <a
            className="plain-link"
            onClick={() => {
              trackEvent({
                category: 'IIIFPresentationPreview',
                action: 'follow link',
                label: itemUrl.href.query.workId,
              });
            }}
          >
            {imageThumbnails.map((pageType, i) => {
              return pageType.images.map(image => {
                return (
                  <IIIFResponsiveImage
                    key={image.id}
                    lang={null}
                    width={image.width * (400 / image.height)}
                    height={400}
                    src={iiifImageTemplate(image.id)({
                      size: ',400',
                    })}
                    srcSet={''}
                    alt=""
                    sizes={null}
                    isLazy={true}
                  />
                );
              });
            })}
            <Button
              icon={'gallery'}
              text={`${imageTotal} images`}
              extraClasses={`btn--primary`}
            />
          </a>
        </NextLink>
      </PresentationPreview>
    );
  }

  if (viewType === 'none') {
    return (
      <div
        className={classNames({
          [spacing({ s: 4 }, { margin: ['bottom'] })]: true,
        })}
      >
        <BetaMessage message="We are working to make this item available online in July 2019." />
      </div>
    );
  } else {
    return null;
  }
};

export default IIIFPresentationDisplay;
