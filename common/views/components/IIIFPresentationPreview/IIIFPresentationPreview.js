// @flow
import fetch from 'isomorphic-unfetch';
import styled from 'styled-components';
import { iiifImageTemplate } from '@weco/common/utils/convert-image-uri';
import { useEffect, useState } from 'react';
import { type iiifPresentationLocation } from '@weco/common/utils/works';

// TODO classes
// TODO use theme verticalSpacing unit
const BookPreviewContainer = styled.div`
  position: relative;
  text-align: center;
  padding: 12px 24px 36px;
  overflow: scroll;

  .btn {
    display: none;
    position: absolute;
    right: 12px;
    top: 50%;
    transform: translateY(-50%);
  }

  .cta {
    background: green;
    grid-column-end: -1;
    grid-row-end: 3;
  }
`;

const BookPreview = styled.div`
  margin: auto;
  display: inline-grid;
  grid-gap: ${props => (props.columnNumber > 1 ? '12px' : 0)};
  ${props => props.theme.media.medium`
    grid-template-columns: ${props => `repeat(${props.columnNumber}, 200px)`};
    grid-template-rows: 200px;
  `}
`;

const PagePreview = styled.div`
  border: ${props => `1px solid ${props.theme.colors.pumice}`};
  overflow: hidden;
  display: none;
  width: 100%;
  height: 100%;

  /* putting the background inside a media query, prevents webkit downloading the images unnecessarily  */
  /* display none is no sufficient to achieve this  */
  ${props => props.theme.media.medium`
    display: block;
    background: center / cover no-repeat url(${props => props.backgroundImage});
  `}

  &:nth-child(3) {
    grid-row-end: 3;
  }

  &:first-child {
    display: block;
    grid-column-start: 1;
    grid-column-end: span 2;
    grid-row-start: 1;
    grid-row-end: span 2;
    height: 412px;
    background: center / contain no-repeat
      url(${props => props.backgroundImage});
  }
`;

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
      id: randomCanvas.thumbnail.service['@id'],
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
          id: matchingCanvas.thumbnail.service['@id'],
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
    : structuredImages.slice(0, idealNumber);
}

type Props = {|
  iiifPresentationLocation: iiifPresentationLocation,
|};

const IIIFPresentationDisplay = ({ iiifPresentationLocation }: Props) => {
  const [imageThumbnails, setImageThumbnails] = useState([]);
  const fetchThumbnails = async () => {
    try {
      const iiifManifest = await fetch(iiifPresentationLocation.url);
      const manifestData = await iiifManifest.json();
      setImageThumbnails(
        previewThumbnails(
          manifestData,
          orderedStructuredImages(structuredImages(manifestData)),
          4
        )
      );
    } catch (e) {}
  };
  useEffect(() => {
    fetchThumbnails();
  }, []);
  const itemsNumber = imageThumbnails.reduce((acc, pageType) => {
    return acc + pageType.images.length;
  }, 0);

  return (
    <BookPreviewContainer>
      <BookPreview
        columnNumber={
          itemsNumber === 1
            ? 3
            : itemsNumber === 3
            ? 4
            : 2 + Math.floor(itemsNumber / 2)
        }
      >
        {imageThumbnails &&
          imageThumbnails.map((pageType, i) => {
            return pageType.images.map(image => {
              return i === 0 ? (
                <PagePreview
                  key={image.id}
                  backgroundImage={iiifImageTemplate(image.id)({
                    size: '!1024,1024',
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
        <div className="cta">View all</div>
      </BookPreview>
    </BookPreviewContainer>
  );
};

export default IIIFPresentationDisplay;
// TODO work out media queries, with diff. numbers of items
// TOOD flow
