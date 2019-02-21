// @flow
import fetch from 'isomorphic-unfetch';
import { iiifImageTemplate } from '@weco/common/utils/convert-image-uri';
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
              </div>
            )}
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
