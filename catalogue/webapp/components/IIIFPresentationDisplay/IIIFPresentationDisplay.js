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

  const structuredCanvasesWithLabel = manifestData && manifestData.structures.map(structure => {
    const canvases = manifestData.sequences
      .reduce((acc, sequence) => acc.concat(sequence.canvases), [])
      .filter(canvas => structure.canvases.indexOf(canvas['@id']) !== -1);

    return {
      label: structure.label,
      canvases: canvases
    };
  });

  return manifestData && (
    <div>
      {structuredCanvasesWithLabel && structuredCanvasesWithLabel.map(structuredCanvas => {
        return (
          <div
            key={structuredCanvas.label}
            style={{
              display: 'flex',
              maxWidth: '100%',
              flexWrap: 'wrap'
            }}>
            <div>{structuredCanvas.label}</div>
            {console.info(structuredCanvas)}
            {structuredCanvas.canvases.map(canvas => {
              return <div key={canvas.thumbnail['@id']} ><img src={canvas.thumbnail['@id']} /></div>;
            })}
          </div>

        );
      })}
      {showAll && validSequences
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
