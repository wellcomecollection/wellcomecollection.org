// @flow
import { type IIIFManifest, type IIIFCanvas } from '@weco/common/model/iiif';
import { type IIIFPresentationLocation } from '@weco/common/utils/works';
import NextLink from 'next/link';
import styled from 'styled-components';
import { iiifImageTemplate } from '@weco/common/utils/convert-image-uri';
import { font, classNames } from '@weco/common/utils/classnames';
import { useEffect, useState, useContext } from 'react';
import { trackEvent } from '@weco/common/utils/ga';
import Icon from '@weco/common/views/components/Icon/Icon';
import ManifestContext from '@weco/common/views/components/ManifestContext/ManifestContext';

const BookPreviewContainer = styled.div`
  overflow: scroll;
  text-align: center;

  /* 42px(container padding) + 200px(image) + 12px(gap) + 200px + 12px + 200px + 42px = 708px */
  @media (min-width: 708px) {
    padding: ${props =>
      `${props.theme.spacingUnit * 4}px 0 ${props.theme.spacingUnit * 6}px`};
  }
`;

const BookPreview = styled.div`
  @media (min-width: 708px) {
    display: ${props => (props.hasThumbs ? 'inline-grid' : 'inline')};
    grid-gap: ${props =>
      props.columnNumber > 1 ? `${props.theme.spacingUnit * 2}px` : 0};
    grid-template-columns: ${props => `repeat(3, 200px)`};
    grid-template-rows: 200px;
  }

  ${props => props.theme.media.large`
    grid-template-columns: ${props => `repeat(${props.columnNumber}, 200px)`};
  `}
`;

const PagePreview = styled.div`
  overflow: hidden;
  display: none;
  width: 200px;
  height: 200px;
  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;

  /* Putting the background inside a media query,
   * prevents webkit downloading the images unnecessarily.
   * Display none is not sufficient */
  @media (min-width: 708px) {
    /* 24px(gutter) + 200px(image) + 12px(gap) + 200px + 12px + 200px + 24px = 708px */
    &:nth-child(2) {
      display: block;
      background-image: url(${props => props.backgroundImage});
    }
  }

  ${props => props.theme.media.large`
    display: block;
    background-image: url(${props => props.backgroundImage});
  `};

  &:nth-child(3) {
    grid-row-end: 3;
  }

  &:first-child {
    display: block;
    height: ${props => `${400 + props.theme.spacingUnit * 2}px`};
    width: 100%;
    background-size: contain;
    background-image: url(${props => props.backgroundImage});
    background-color: ${props => props.theme.colors.smoke};

    @media (min-width: 708px) {
      grid-column-start: 1;
      grid-column-end: span 2;
      grid-row-start: 1;
      grid-row-end: span 2;
    }

    ${props => props.theme.media.large`
    grid-template-columns: ${props => `repeat(${props.columnNumber}, 200px)`};
  `}
  }
`;

const CallToAction = styled.div`
  display: inline-block;
  padding: 6px 24px;
  grid-row-end: 3;
  ${props => props.hasThumbs && 'transform: translateY(-50%)'};
  background: ${props => props.theme.colors.green};
  color: ${props => props.theme.colors.white};
  transition: all 500ms ease;

  @media (min-width: 708px) {
    transform: none;
  }

  a:hover &,
  a:focus & {
    background: ${props => props.theme.colors.black};
  }

  .icon {
    margin-right: 6px;
  }

  .icon__shape {
    fill: currentColor;
  }

  .cta__inner {
    @media (min-width: 708px) {
      display: block;
      position: relative;
      top: 50%;
      transform: translateY(-50%);
    }
  }

  .cta__text {
    display: block;
  }
`;

function getCanvases(iiifManifest: IIIFManifest): IIIFCanvas[] {
  const sequence = iiifManifest.sequences.find(
    sequence => sequence['@type'] === 'sc:Sequence'
  );
  return sequence ? sequence.canvases : [];
}
type IIIFThumbnails = {|
  label: string,
  images: {
    id: string,
    canvasId: string,
  }[],
|};

// Ideal preview thumbnails order: Title page, Front Cover, first page of Table of Contents, 2 random.
// If we don't have any of the structured pages, we fill with random ones, so there are always 4 images if possible.
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
    images.push({
      id: randomCanvas.thumbnail.service['@id'],
      canvasId: randomCanvas['@id'],
    });
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
                id: matchingCanvas.thumbnail.service['@id'],
                canvasId: matchingCanvas && matchingCanvas['@id'],
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
  idealNumber: number = 4
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

const IIIFPresentationDisplay = ({
  iiifPresentationLocation,
  itemUrl,
}: Props) => {
  const [imageThumbnails, setImageThumbnails] = useState([]);
  const [imageTotal, setImageTotal] = useState(null);
  const iiifPresentationManifest = useContext(ManifestContext);
  const fetchThumbnails = async () => {
    if (iiifPresentationManifest) {
      setImageTotal(getCanvases(iiifPresentationManifest).length);
      setImageThumbnails(
        previewThumbnails(
          iiifPresentationManifest,
          orderedStructuredImages(structuredImages(iiifPresentationManifest)),
          4
        )
      );
    }
  };
  useEffect(() => {
    fetchThumbnails();
  }, [iiifPresentationManifest]);
  const itemsNumber = imageThumbnails.reduce((acc, pageType) => {
    return acc + pageType.images.length;
  }, 0);

  return (
    <BookPreviewContainer>
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
          <BookPreview
            columnNumber={
              itemsNumber === 1
                ? 3
                : itemsNumber === 3
                ? 4
                : 2 + Math.floor(itemsNumber / 2)
            }
            hasThumbs={imageThumbnails.length > 0}
          >
            {imageThumbnails.map((pageType, i) => {
              return pageType.images.map(image => {
                return i === 0 ? (
                  <PagePreview
                    key={image.id}
                    backgroundImage={iiifImageTemplate(image.id)({
                      size: 'max',
                    })}
                  />
                ) : (
                  <PagePreview
                    key={image.id}
                    backgroundImage={iiifImageTemplate(image.id)({
                      size: '!400,400',
                    })}
                  />
                );
              });
            })}
            <CallToAction
              hasThumbs={imageThumbnails.length > 0}
              className={classNames({
                [font({ s: 'HNM4' })]: true,
              })}
            >
              <span className="cta__inner">
                <span
                  className={classNames({
                    'flex-inline': true,
                    'flex--v-center': true,
                  })}
                >
                  <Icon name="gallery" />
                  {imageTotal}
                </span>
                <span className="cta__text">Full view</span>
              </span>
            </CallToAction>
          </BookPreview>
        </a>
      </NextLink>
    </BookPreviewContainer>
  );
};

export default IIIFPresentationDisplay;
