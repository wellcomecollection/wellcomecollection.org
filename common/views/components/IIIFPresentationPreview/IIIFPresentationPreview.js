// @flow
import fetch from 'isomorphic-unfetch';
import { Fragment, useState, useEffect } from 'react';

type Props = {|
  manifestLocation: string,
|};

const IIIFPresentationDisplay = ({ manifestLocation }: Props) => {
  const [manifestData, setManifestData] = useState(null);

  useEffect(() => {
    fetch(manifestLocation)
      .then(resp => resp.json())
      .then(json => {
        setManifestData(json);
      });
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

  return (
    manifestData && (
      <Fragment>
        {validSequences.length > 0 &&
          validSequences.map(sequence => (
            <Fragment key={sequence['@id']}>
              {sequence.canvases.length > 1 &&
                sequence.canvases.slice(0, 1).map(canvas => {
                  return (
                    <div key={canvas.thumbnail['@id']}>
                      <img
                        style={{ width: '64px' }}
                        src={canvas.thumbnail['@id']}
                      />
                    </div>
                  );
                })}
            </Fragment>
          ))}
      </Fragment>
    )
  );
};

export default IIIFPresentationDisplay;
// TODO image alt
// TODO show specific pages e.g. cover OR title page OR first image
// TODO don't want to show section in WorkDetails if no valid sequences
