// @flow
import { iiifImageTemplate } from '@weco/common/utils/convert-image-uri';
import { Fragment } from 'react';
import styled from 'styled-components';

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
                <div key={sequence.canvases[0].thumbnail['@id']}>
                  <img
                    style={{ width: 'auto' }}
                    src={iiifImageTemplate(
                      sequence.canvases[0].thumbnail.service['@id']
                    )({ size: `,${previewSize * 2}` })}
                  />
                </div>
              )}
              {showMultiImageWorkPreview && (
                <ScrollContainer
                  key={`${sequence.canvases[0].thumbnail['@id']}-2`}
                >
                  <div>
                    {sequence.canvases.map(canvas => {
                      return (
                        <img
                          key={canvas.thumbnail.service['@id']}
                          style={{
                            width: 'auto',
                            height: `${previewSize}px`,
                            marginRight: '3px',
                          }}
                          src={iiifImageTemplate(
                            canvas.thumbnail.service['@id']
                          )({
                            size: `,${previewSize}`,
                          })}
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
// TODO lazyLoad multi thumbnails and no-js version
// TODO image alt
// TODO show specific pages e.g. cover OR title page OR first image?
// TODO what happens when no javascript available
// TODO import IIIFBookPreview?
