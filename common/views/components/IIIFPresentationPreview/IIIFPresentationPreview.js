// @flow
import { iiifImageTemplate } from '@weco/common/utils/convert-image-uri';
import { Fragment } from 'react';
import styled from 'styled-components';
import { classNames } from '../../../utils/classnames';

const BookContainer = styled.div`
  display: inline-block;
  position: relative;
  z-index: 1;
  margin-bottom: 20px;
  word-spacing: 0;

  & > img {
    display: block;
  }

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

  return (
    <Fragment>
      {validSequences.map(sequence => (
        <Fragment key={sequence['@id']}>
          {sequence.canvases.length > 1 && (
            <Fragment>
              {!showMultiImageWorkPreview && (
                <BookContainer key={sequence.canvases[0].thumbnail['@id']}>
                  <img
                    style={{ width: 'auto' }}
                    src={iiifImageTemplate(
                      sequence.canvases[0].thumbnail.service['@id']
                    )({ size: `,${previewSize * 2}` })}
                  />
                </BookContainer>
              )}
              {showMultiImageWorkPreview && (
                <ScrollContainer
                  key={`${sequence.canvases[0].thumbnail['@id']}-2`}
                >
                  <div>
                    {sequence.canvases.map((canvas, i) => {
                      return (
                        <img
                          key={canvas.thumbnail.service['@id']}
                          className={classNames({
                            'lazy-image lazyload': i > 3,
                          })}
                          style={{
                            width: 'auto',
                            height: `${previewSize}px`,
                            marginRight: '3px',
                          }}
                          src={
                            i < 4
                              ? iiifImageTemplate(
                                  canvas.thumbnail.service['@id']
                                )({
                                  size: `,${previewSize}`,
                                })
                              : null
                          }
                          data-src={
                            i > 3
                              ? iiifImageTemplate(
                                  canvas.thumbnail.service['@id']
                                )({
                                  size: `,${previewSize}`,
                                })
                              : null
                          }
                        />
                      );
                    })}
                  </div>
                </ScrollContainer>
              )}
              <p className="no-margin">{sequence.canvases.length} images</p>
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
// How launch viewer and what happens in no js land
