// @flow
import { iiifImageTemplate } from '@weco/common/utils/convert-image-uri';
import React, { Fragment, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { classNames } from '../../../utils/classnames';
import Button from '@weco/common/views/components/Buttons/Button/Button';

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
  outline: none;

  &:focus::before {
    content: 'Scroll through the images with arrow keys';
    position: absolute;
    margin-top: -1.8em;
  }

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
  showMultiImageWorkPreview: boolean,
|};

const IIIFPresentationDisplay = ({
  manifestData,
  showMultiImageWorkPreview,
}: Props) => {
  const validSequences =
    (manifestData &&
      manifestData.sequences
        // This returns a broken resource
        .filter(
          ({ compatibilityHint }) =>
            compatibilityHint !== 'displayIfContentUnsupported'
        )) ||
    [];

  const previewSize = 200;
  const previewArea = useRef(null);
  const linkRefs = {};

  validSequences.forEach(sequence => {
    sequence.canvases.forEach(
      canvas =>
        (linkRefs[`${canvas.thumbnail.service['@id']}`] = React.createRef())
    );
  });

  useEffect(() => {
    const options = {
      root: previewArea.current,
      rootMargin: '0px',
      threshold: 0.5,
    };
    function callback(links, observer) {
      links.forEach(link => {
        if (link.isIntersecting) {
          link.target.setAttribute('tabindex', '0');
        } else {
          link.target.setAttribute('tabindex', '-1');
        }
      });
    }

    const observer = new window.IntersectionObserver(callback, options);
    validSequences.forEach(sequence => {
      sequence.canvases.forEach(canvas => {
        observer.observe(
          linkRefs[`${canvas.thumbnail.service['@id']}`].current
        );
      });
    });
  }, []);

  return (
    <Fragment>
      {validSequences.map(sequence => (
        <Fragment key={sequence['@id']}>
          {sequence.canvases.length > 1 && (
            <Fragment>
              {!showMultiImageWorkPreview && (
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
              )}
              {showMultiImageWorkPreview && (
                <ScrollContainer
                  ref={previewArea}
                  key={`${sequence.canvases[0].thumbnail['@id']}-2`}
                  tabIndex="0"
                >
                  <div>
                    {sequence.canvases.map((canvas, i) => {
                      return (
                        <a
                          ref={linkRefs[`${canvas.thumbnail.service['@id']}`]}
                          key={canvas.thumbnail.service['@id']}
                          tabIndex={i < 4 ? 0 : -1}
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
              )}
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
// TODO image alt - how do we handle this
// TODO if we go with single image then show specific page if available title page, then cover, then first image (preferably first text image, not blank page)
// TODO import IIIFBookPreview?
// TODO layout / styling
// TODO tabindexes on anchors around lazyloaded images should be set to 0 with javascript when items are in view, else -1
