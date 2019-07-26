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
import { classNames, spacing, grid } from '@weco/common/utils/classnames';
import { type Node, useEffect, useState, useContext, useRef } from 'react';
import { trackEvent } from '@weco/common/utils/ga';
import ManifestContext from '@weco/common/views/components/ManifestContext/ManifestContext';
import Button from '@weco/common/views/components/Buttons/Button/Button';
import BetaMessage from '@weco/common/views/components/BetaMessage/BetaMessage';
import IIIFResponsiveImage from '@weco/common/views/components/IIIFResponsiveImage/IIIFResponsiveImage';
import WobblyRow from '@weco/common/views/components/WobblyRow/WobblyRow';
import useOnScreen from '@weco/common/hooks/useOnScreen';

const MultiVolumeContainer = styled.div`
  box-shadow: ${props =>
    props.isOnScreen || props.hasBeenSeen
      ? `12px 12px 0px 0px ${props.theme.colors.yellow}`
      : `0px 0px 0px 0px ${props.theme.colors.yellow}`};
  margin: ${props =>
    props.isOnScreen || props.hasBeenSeen ? '0 auto 12px' : '0 auto'};
  transition: all 1200ms ease;
`;

const PresentationPreview = styled.div`
  text-align: center;
  position: relative;
  a {
    overflow: hidden;
    display: inline-flex;
    width: 100%;
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
  img:first-of-type:last-of-type {
    margin: auto;
  }
  .btn--primary {
    position: absolute;
    z-index: 3;
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

function getVideo(iiifManifest: IIIFManifest) {
  const videoSequence =
    iiifManifest &&
    iiifManifest.mediaSequences &&
    iiifManifest.mediaSequences.find(sequence =>
      sequence.elements.find(
        element => element['@type'] === 'dctypes:MovingImage'
      )
    );
  return (
    videoSequence &&
    videoSequence.elements.find(
      element => element['@type'] === 'dctypes:MovingImage'
    )
  );
}

function getAudio(iiifManifest: IIIFManifest) {
  const videoSequence =
    iiifManifest &&
    iiifManifest.mediaSequences &&
    iiifManifest.mediaSequences.find(sequence =>
      sequence.elements.find(element => element['@type'] === 'dctypes:Sound')
    );
  return (
    videoSequence &&
    videoSequence.elements.find(element => element['@type'] === 'dctypes:Sound')
  );
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
  childManifestsCount?: number,
|};

type ViewType =
  | 'unknown'
  | 'multi'
  | 'iiif'
  | 'pdf'
  | 'video'
  | 'audio'
  | 'none';
// Can we show the user the work described by the manifest?
// unknown === can't/haven't checked
// iiif | pdf | video | audio === checked manifest and can render
// none === checked manifest and know we can't render it
type MultiVolumePreviewProps = {|
  children: Node,
|};

const MultiVolumePreview = ({ children }: MultiVolumePreviewProps) => {
  const [hasBeenSeen, setHasBeenSeen] = useState(false);
  const multiPreview = useRef();
  const isOnScreen = useOnScreen({ ref: multiPreview, threshold: 0.75 });
  useEffect(() => {
    if (!hasBeenSeen) {
      setHasBeenSeen(isOnScreen);
    }
  }, [isOnScreen]);

  return (
    <MultiVolumeContainer
      ref={multiPreview}
      hasBeenSeen={hasBeenSeen}
      isOnScreen={isOnScreen}
    >
      {children}
    </MultiVolumeContainer>
  );
};

const IIIFPresentationDisplay = ({
  iiifPresentationLocation,
  itemUrl,
  childManifestsCount = 0,
}: Props) => {
  const [viewType, setViewType] = useState<ViewType>('unknown');
  const [imageThumbnails, setImageThumbnails] = useState([]);
  const [imageTotal, setImageTotal] = useState(0);
  const iiifPresentationManifest = useContext(ManifestContext);
  const video = getVideo(iiifPresentationManifest);
  const audio = getAudio(iiifPresentationManifest);

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
      <div className="container">
        <div className="grid">
          <div className={grid({ s: 12, m: 12, l: 12, xl: 12 })}>
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
            </div>{' '}
          </div>{' '}
        </div>{' '}
      </div>
    );
  }

  if (viewType === 'iiif') {
    return (
      <WobblyRow>
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
              {childManifestsCount === 0 &&
                imageThumbnails.map((pageType, i) => {
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
              {childManifestsCount > 0 &&
                imageThumbnails.slice(0, 1).map((pageType, i) => {
                  return pageType.images.map(image => {
                    return (
                      <MultiVolumePreview key={image.id}>
                        <IIIFResponsiveImage
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
                      </MultiVolumePreview>
                    );
                  });
                })}
              <Button
                icon={childManifestsCount > 0 ? 'zoomIn' : 'gallery'}
                text={
                  childManifestsCount > 0
                    ? `${childManifestsCount} volumes online`
                    : `${imageTotal} images`
                }
                extraClasses={`btn--primary`}
              />
            </a>
          </NextLink>
        </PresentationPreview>
      </WobblyRow>
    );
  }

  if (viewType === 'video' && video) {
    return (
      <div className="container">
        <div className="grid">
          <div className={grid({ s: 12, m: 12, l: 12, xl: 12 })}>
            <div
              className={classNames({
                [spacing({ s: 4 }, { margin: ['bottom'] })]: true,
              })}
            >
              <video
                controls
                style={{
                  maxWidth: '100%',
                  maxHeight: '70vh',
                  display: 'block',
                  margin: 'auto',
                }}
              >
                <source src={video['@id']} type={video.format} />
                {`Sorry, your browser doesn't support embedded video.`}
              </video>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (viewType === 'audio' && audio) {
    return (
      <div className="container">
        <div className="grid">
          <div className={grid({ s: 12, m: 12, l: 12, xl: 12 })}>
            <div
              className={classNames({
                [spacing({ s: 4 }, { margin: ['bottom'] })]: true,
              })}
            >
              <audio
                controls
                style={{
                  maxWidth: '100%',
                  display: 'block',
                  margin: 'auto',
                }}
                src={audio['@id']}
              >
                {`Sorry, your browser doesn't support embedded audio.`}
              </audio>
            </div>{' '}
          </div>{' '}
        </div>{' '}
      </div>
    );
  }

  if (viewType === 'none') {
    return (
      <div className="container">
        <div className="grid">
          <div className={grid({ s: 12, m: 12, l: 12, xl: 12 })}>
            <div
              className={classNames({
                [spacing({ s: 4 }, { margin: ['bottom'] })]: true,
              })}
            >
              <BetaMessage message="We are working to make this item available online in July 2019." />
            </div>
          </div>
        </div>
      </div>
    );
  } else {
    return null;
  }
};

export default IIIFPresentationDisplay;
