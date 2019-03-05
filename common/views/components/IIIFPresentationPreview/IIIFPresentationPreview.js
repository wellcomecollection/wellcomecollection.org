// @flow
import { iiifImageTemplate } from '@weco/common/utils/convert-image-uri';
import { Fragment, useEffect, useState } from 'react';
import styled from 'styled-components';
import { classNames } from '../../../utils/classnames';
import Button from '@weco/common/views/components/Buttons/Button/Button';

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
      const matchingCanvas = iiifManifest.sequences
        .find(sequence => sequence['@type'] === 'sc:Sequence')
        .canvases.find(canvas => {
          return canvas['@id'] === canvasId;
        });
      return {
        orientation:
          matchingCanvas.thumbnail.service.width >
          matchingCanvas.thumbnail.service.height
            ? 'landscape'
            : 'portrait',
        uri: iiifImageTemplate(matchingCanvas.thumbnail.service['@id'])({
          size: '!400,400',
        }),
        canvasId,
      };
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

const BookContainer = styled.div`
  display: inline-block;
  position: relative;
  z-index: 1;
  margin-bottom: 20px;
  word-spacing: 0;

  & > img,
  &::before,
  &::after {
    /* Add shadow to distinguish sheets from one another */
    box-shadow: 2px 1px 1px rgba(0, 0, 0, 0.15);
  }

  &::before,
  &::after {
    content: '';
    position: absolute;
    width: 100%;
    height: 100%;
    background-color: #fff;
  }

  /* Second sheet of paper */
  &::before {
    left: 7px;
    top: 7px;
    z-index: -1;
  }

  /* Third sheet of paper */
  &::after {
    left: 14px;
    top: 14px;
    z-index: -2;
  }

  img {
    display: block;
  }
`;

const ScrollContainer = styled.div`
  overflow-x: scroll;

  &::-webkit-scrollbar {
    margin-top: ${props => `${props.theme.spacingUnit}px`};
    height: ${props => `${props.theme.spacingUnit * 5}px`};
    background: ${props => props.theme.colors.cream};
  }

  &::-webkit-scrollbar-thumb {
    border-radius: 0;
    border-style: solid;
    border-width: ${props => `${props.theme.spacingUnit * 2}px 0`};
    border-color: ${props => props.theme.colors.cream};
    background: ${props => props.theme.colors.marble};
  }

  & > div {
    display: flex;
  }
`;

type Props = {|
  manifestData: any,
|};

const IIIFPresentationDisplay = ({ manifestData }: Props) => {
  const [imageThumbnails, setImageThumbnails] = useState(false);
  useEffect(() => {
    setImageThumbnails(
      previewThumbnails(
        manifestData,
        orderedStructuredImages(structuredImages(manifestData)),
        5
      )
    );
  }, []);
  const validSequences =
    (manifestData &&
      manifestData.sequences
        // This returns a broken resource
        .filter(
          ({ compatibilityHint }) =>
            compatibilityHint !== 'displayIfContentUnsupported'
        )) ||
    [];

  const previewSize = 400;

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
      {validSequences.map(sequence => (
        <Fragment key={sequence['@id']}>
          {sequence.canvases.length > 1 && (
            <Fragment>
              <BookContainer key={sequence.canvases[0].thumbnail['@id']}>
                <a
                  href={iiifImageTemplate(
                    sequence.canvases[0].thumbnail.service['@id']
                  )({ size: '!1024,1024' })}
                >
                  <img
                    style={
                      sequence.canvases[0].thumbnail.service.width <=
                      sequence.canvases[0].thumbnail.service.height
                        ? { width: 'auto', height: '300px' }
                        : { width: '300px', height: 'auto' }
                    }
                    src={iiifImageTemplate(
                      sequence.canvases[0].thumbnail.service['@id']
                    )({ size: `!${previewSize},${previewSize}` })}
                  />
                </a>
              </BookContainer>
              <ScrollContainer
                key={`${sequence.canvases[0].thumbnail['@id']}-2`}
              >
                <div>
                  {sequence.canvases.map((canvas, i) => {
                    return (
                      <a
                        key={canvas.thumbnail.service['@id']}
                        href={iiifImageTemplate(
                          canvas.thumbnail.service['@id']
                        )({ size: '!1024,1024' })}
                      >
                        <img
                          className={classNames({
                            'lazy-image lazyload': i > 3,
                          })}
                          style={
                            canvas.thumbnail.service.width <=
                            canvas.thumbnail.service.height
                              ? {
                                  width: 'auto',
                                  height: '300px',
                                  marginRight: '12px',
                                }
                              : {
                                  width: '300px',
                                  height: 'auto',
                                  marginRight: '12px',
                                }
                          }
                          src={
                            i < 4
                              ? iiifImageTemplate(
                                  canvas.thumbnail.service['@id']
                                )({
                                  size: `!${previewSize},${previewSize}`,
                                })
                              : null
                          }
                          data-src={
                            i > 3
                              ? iiifImageTemplate(
                                  canvas.thumbnail.service['@id']
                                )({
                                  size: `!${previewSize},${previewSize}`,
                                })
                              : null
                          }
                        />
                      </a>
                    );
                  })}
                </div>
              </ScrollContainer>
              {/* TODO temporary links to large image for testing, while we don't have a viewer */}
              <div>
                <Button
                  type="primary"
                  url={iiifImageTemplate(
                    sequence.canvases[0].thumbnail.service['@id']
                  )({ size: '!1024,1024' })}
                  text={`View all ${sequence.canvases.length} images`}
                  icon="gallery"
                />
              </div>
            </Fragment>
          )}
        </Fragment>
      ))}
    </Fragment>
  );
};

export default IIIFPresentationDisplay;
// TODO image alt - how do we handle this - no need images are just presentational now, so add correct aria
// TODO import IIIFBookPreview?
// TODO layout / styling
