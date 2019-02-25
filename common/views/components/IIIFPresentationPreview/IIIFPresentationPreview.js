// @flow
import { iiifImageTemplate } from '@weco/common/utils/convert-image-uri';
import { Fragment } from 'react';

type Props = {|
  manifestData: any,
|};

const IIIFPresentationDisplay = ({ manifestData }: Props) => {
  const validSequences =
    (manifestData &&
      manifestData.sequences
        // This returns a broken resource
        .filter(
          ({ compatibilityHint }) =>
            compatibilityHint !== 'displayIfContentUnsupported'
        )) ||
    [];

  return (
    <Fragment>
      {validSequences.map(sequence => (
        <Fragment key={sequence['@id']}>
          {sequence.canvases.length > 1 && (
            <div key={sequence.canvases[0].thumbnail['@id']}>
              <img
                style={{ width: 'auto' }}
                src={iiifImageTemplate(
                  sequence.canvases[0].thumbnail.service['@id']
                )({ size: `,400` })}
              />
              <p>{sequence.canvases.length} images</p>
            </div>
          )}
        </Fragment>
      ))}
    </Fragment>
  );
};

export default IIIFPresentationDisplay;
// TODO image alt
// TODO show specific pages e.g. cover OR title page OR first image?
// TODO what happens when no javascript available
// TODO import IIIFBookPreview?
