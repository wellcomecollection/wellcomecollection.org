// @flow
import fetch from 'isomorphic-unfetch';
import {useState, useEffect} from 'react';
import Button from '@weco/common/views/components/Buttons/Button/Button';

type Props = {|
  manifestLocation: string,
  physicalDescription: string
|}

const IIIFPresentationDisplay = ({
  manifestLocation,
  physicalDescription
}: Props) => {
  const [manifestData, setManifestData] = useState(null);
  const [show, setShow] = useState(false);

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
    <div style={{
      maxWidth: '1036px',
      margin: '0 auto'
    }}>

      <Button type={'primary'} text={'Show preview'} clickHandler={(event) => setShow('preview')} />
      <Button type={'primary'} text={'Show overview'} clickHandler={(event) => setShow('overview')} />
      <Button type={'primary'} text={'Show reading'} clickHandler={(event) => setShow('reading')} />

      {show === 'preview' &&
        <div>
          <div style={{
            display: 'inline-block'
          }}>
            <div style={{
              background: 'rgba(1, 1, 1, .75)',
              color: 'white',
              padding: '12px'
            }}>{physicalDescription}</div>
            <div>
              {structuredCanvasesWithLabel && structuredCanvasesWithLabel.map(structuredCanvas => {
                return structuredCanvas.canvases.map(canvas => {
                  return <img
                    key={canvas.thumbnail['@id']}
                    style={{ width: 'auto' }}
                    src={canvas.thumbnail['@id']} />;
                });
              })}
            </div>
          </div>
        </div>
      }
      {show === 'overview' && validSequences
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
      {show === 'reading' && validSequences
        .map(sequence => (
          <div
            key={sequence['@id']}
            style={{
              maxWidth: '800px',
              margin: '0 auto'
            }}>
            {sequence
              .canvases
              .slice(0, 15)
              .map(canvas => {
                return (<div key={canvas.thumbnail['@id']} ><img src={canvas.images[0].resource['@id']} /></div>);
              })}
          </div>
        ))
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
