// @flow
import fetch from 'isomorphic-unfetch';
import { useState, useEffect } from 'react';
// import Image - thumbnails?
type Props = {|
  manifestLocation: string,
|};

const WorkBookPreview = ({ manifestLocation }: Props) => {
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

  console.log(validSequences);
  // Which image should we show - cover? titlePage?
  return <p>hello</p>;
  // if (validSequences.length > 0) {
  //   return validSequences.map(sequence => {
  //     return sequence.canvases.slice(0, 1).map(canvas => {
  //       return (
  //         <div key={canvas.thumbnail['@id']}>
  //           <img src={canvas.thumbnail['@id']} />
  //         </div>
  //       );
  //     });
  //   });
  // }
};

export default WorkBookPreview;
