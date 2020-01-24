// @flow
import { type IIIFManifest } from '@weco/common/model/iiif';
import {
  getCanvases,
  getManifestViewType,
  getAudio,
  getVideo,
} from '@weco/common/utils/works';
import NextLink from 'next/link';
import Router from 'next/router';
import styled from 'styled-components';
import { iiifImageTemplate } from '@weco/common/utils/convert-image-uri';
import { grid } from '@weco/common/utils/classnames';
import { type Node, useEffect, useState, useContext, useRef } from 'react';
import { trackEvent } from '@weco/common/utils/ga';
import ManifestContext from '@weco/common/views/components/ManifestContext/ManifestContext';
import Button from '@weco/common/views/components/Buttons/Button/Button';
import BetaMessage from '@weco/common/views/components/BetaMessage/BetaMessage';
import IIIFResponsiveImage from '@weco/common/views/components/IIIFResponsiveImage/IIIFResponsiveImage';
import WobblyRow from '@weco/common/views/components/WobblyRow/WobblyRow';
import Space from '../styled/Space';
import useOnScreen from '@weco/common/hooks/useOnScreen';
import useInterval from '@weco/common/hooks/useInterval';

const MultiVolumeContainer = styled.div`
  box-shadow: ${props =>
    props.isOnScreen
      ? `12px 12px 0px 0px ${props.theme.colors.yellow}`
      : `0px 0px 0px 0px ${props.theme.colors.yellow}`};
  margin: 0 auto 12px;
  transition: all 600ms ease;
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
    id: ?string,
    canvasId: string,
    width: number,
    height: number,
  }[],
|};

// We want to display the images at 400px high (400px is a size available from the thumbnail service)
// However, we can only use the thumbnail service, with its associated performance benefits, if the image is not landscape.
// When the image is landscape, the image from the thumbnail service has a width of 400px
function appropriateServiceId(canvas) {
  const mainImageServiceId = Array.isArray(canvas.images[0].resource.service)
    ? null
    : canvas.images[0].resource.service['@id'];
  const thumbnailImageServiceId =
    canvas.thumbnail && canvas.thumbnail.service['@id'];
  if (canvas.width > canvas.height && mainImageServiceId) {
    return mainImageServiceId;
  } else if (thumbnailImageServiceId) {
    return thumbnailImageServiceId;
  } else {
    return null;
  }
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
    if (randomCanvas.thumbnail && randomCanvas.thumbnail.service) {
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
    ? structuredImages
        .concat(
          randomImages(
            iiifManifest,
            structuredImages,
            idealNumber - structuredImages.length
          )
        )
        .filter(x => {
          return x.images.filter(image => image.id).length > 0;
        })
    : structuredImages.slice(0, idealNumber).filter(x => {
        return x.images.filter(image => image.id).length > 0;
      });
}

type Props = {|
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
  const multiPreview = useRef();
  const isOnScreen = useOnScreen({ ref: multiPreview, threshold: 0.75 });

  return (
    <MultiVolumeContainer ref={multiPreview} isOnScreen={isOnScreen}>
      {children}
    </MultiVolumeContainer>
  );
};

const IIIFPresentationPreview = ({
  itemUrl,
  childManifestsCount = 0,
}: Props) => {
  const [viewType, setViewType] = useState<ViewType>('unknown');
  const [imageThumbnails, setImageThumbnails] = useState([]);
  const [hasThumbnails, setHasThumbnails] = useState(false);
  const [imageTotal, setImageTotal] = useState(0);
  const [secondsPlayed, setSecondsPlayed] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const iiifPresentationManifest = useContext(ManifestContext);
  const video = getVideo(iiifPresentationManifest);
  const audio = getAudio(iiifPresentationManifest);

  useEffect(() => {
    const allImages = imageThumbnails.reduce(
      (acc, thumb) => [...acc, ...thumb.images],
      []
    );
    setHasThumbnails(allImages.length > 0);
  }, [imageThumbnails]);

  function trackViewingTime() {
    trackEvent({
      category: 'Engagement',
      action: `Amount of media played`,
      value: secondsPlayed,
      nonInteraction: true,
      transport: 'beacon',
      label: video ? 'Video' : 'Audio',
    });
  }

  useEffect(() => {
    Router.events.on('routeChangeStart', trackViewingTime);

    try {
      window.addEventListener('beforeunload', trackViewingTime);
    } catch (error) {
      trackEvent({
        category: 'Engagement',
        action: 'unable to track media playing time',
        nonInteraction: true,
      });
    }

    return () => {
      try {
        window.removeEventListener('beforeunload', trackViewingTime);
        Router.events.off('routeChangeStart', trackViewingTime);
      } catch (error) {}
    };
  }, []);

  useInterval(
    () => {
      setSecondsPlayed(secondsPlayed + 1);
    },
    isPlaying ? 1000 : null
  );

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
            <Space
              v={{
                size: 'm',
                properties: ['margin-top', 'margin-bottom'],
              }}
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
            </Space>{' '}
          </div>{' '}
        </div>{' '}
      </div>
    );
  }

  if (viewType === 'iiif' && hasThumbnails) {
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
                      image.id && (
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
                      )
                    );
                  });
                })}
              {childManifestsCount > 0 &&
                imageThumbnails.slice(0, 1).map((pageType, i) => {
                  return pageType.images.map(image => {
                    return (
                      image.id && (
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
                      )
                    );
                  });
                })}
              <Button
                icon={childManifestsCount > 0 ? 'zoomIn' : 'gallery'}
                text={
                  childManifestsCount > 0
                    ? `${childManifestsCount} volumes`
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
      <WobblyRow>
        <Space v={{ size: 'l', properties: ['margin-bottom'] }}>
          <video
            onPlay={() => {
              setIsPlaying(true);

              trackEvent({
                category: 'Video',
                action: 'play video',
                label: video['@id'],
              });
            }}
            onPause={() => {
              setIsPlaying(false);
            }}
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
        </Space>
      </WobblyRow>
    );
  }

  if (viewType === 'audio' && audio) {
    return (
      <WobblyRow>
        <Space v={{ size: 'l', properties: ['margin-bottom'] }}>
          <audio
            onPlay={() => {
              setIsPlaying(true);

              trackEvent({
                category: 'Audio',
                action: 'play audio',
                label: audio['@id'],
              });
            }}
            onPause={() => {
              setIsPlaying(false);
            }}
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
        </Space>{' '}
      </WobblyRow>
    );
  }
  if (viewType === 'none') {
    return (
      <div className="container">
        <div className="grid">
          <div className={grid({ s: 12, m: 12, l: 12, xl: 12 })}>
            <Space v={{ size: 'l', properties: ['margin-bottom'] }}>
              <BetaMessage message="We are working to make this item available online." />
            </Space>
          </div>
        </div>
      </div>
    );
  } else {
    return null;
  }
};

export default IIIFPresentationPreview;
