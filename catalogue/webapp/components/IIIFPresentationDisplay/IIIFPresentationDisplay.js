// @flow
import fetch from 'isomorphic-unfetch';
import {useState, useEffect} from 'react';
import Button from '@weco/common/views/components/Buttons/Button/Button';

type Props = {|
  manifestLocation: string
|}

const IIIFPresentationDisplay = ({
  manifestLocation
}: Props) => {
  const [manifestData, setManifestData] = useState(null);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    fetch(manifestLocation).then(resp => resp.json()).then(json => {
      setManifestData(json);
    });
  }, []);

  const validSequences = manifestData && manifestData
    .sequences
    // This returns a broken resource
    .filter(({compatibilityHint}) => compatibilityHint !== 'displayIfContentUnsupported') || [];

  return manifestData && (
    <div>
      {validSequences
        .map(sequence => (
          <div
            key={sequence['@id']}
            style={{
              display: 'flex',
              maxWidth: '100%',
              flexWrap: 'wrap'
            }}>
            {sequence
              .canvases
              .slice(0, showAll ? sequence.canvases.length : 5)
              .map(canvas => {
                return (<div key={canvas.thumbnail['@id']} ><img src={canvas.thumbnail['@id']} /></div>);
              })}
          </div>
        ))
      }
      {!showAll && validSequences.length > 0  &&
        <Button type={'primary'} text={'Show all'} clickHandler={(event) => setShowAll(true)} />
      }

      {(manifestData.mediaSequences || [])
        // This returns a broken resource
        .filter(({compatibilityHint}) => compatibilityHint !== 'displayIfContentUnsupported')
        .map(sequence => {
          return sequence.elements.map(element => {
            if (element['@type'] === 'dctypes:MovingImage') {
              return (
                <video controls style={{ margin: '0 auto', display: 'block', maxWidth: '100%' }}>
                  {element.rendering.map(render => (
                    <source key={render['@id']} src={render['@id']} format={render.format} />
                  ))}
                </video>
              );
            }
            return (<p key={element['@id']}>Unknown type {element['@type']}</p>);
          });
        })}
    </div>
  );
};
export default IIIFPresentationDisplay;
