// @flow
import fetch from 'isomorphic-unfetch';
import {useState, useEffect} from 'react';
import Button from '@weco/common/views/components/Buttons/Button/Button';
import {spacing, grid, classNames} from '@weco/common/utils/classnames';

type Props = {|
  manifestLocation: string,
  physicalDescription: string
|}

const IIIFPresentationDisplay = ({
  manifestLocation,
  physicalDescription
}: Props) => {
  const [manifestData, setManifestData] = useState(null);
  const [show, setShow] = useState('preview');

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
      {/* <div style={{
        position: 'sticky'
      }}>
        <Button type={'primary'} text={'Show preview'} clickHandler={(event) => setShow('preview')} />
        <Button type={'primary'} text={'Show overview'} clickHandler={(event) => setShow('overview')} />
        <Button type={'primary'} text={'Show reading'} clickHandler={(event) => setShow('reading')} />
    </div> */}

      {show === 'preview' &&
        <div>
          <div style={{
            display: 'block'
          }}>
            <div style={{
              display: 'flex',
              maxWidth: '100%',
              overflow: 'scroll',
              justifyContent: 'space-between'
            }}>
              {structuredCanvasesWithLabel && structuredCanvasesWithLabel.map(structuredCanvas => {
                return structuredCanvas.canvases.map(canvas => {
                  return <div key={canvas.thumbnail['@id']}>
                    <img src={canvas.images[0].resource['@id']} />
                  </div>;
                });
              })}
            </div>
          </div>
        </div>
      }
      {show === 'overview' &&
        <div style={{
          height: '70vh',
          background: 'hotpink',
          overflow: 'scroll'
        }}>
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
                  .map(canvas => {
                    return (<div key={canvas.thumbnail['@id']} ><img src={canvas.thumbnail['@id']} /></div>);
                  })}
              </div>
            ))
          }
        </div>
      }
      {show === 'reading' &&
        <div style={{
          height: '70vh',
          background: 'hotpink',
          overflow: 'scroll'
        }}>
          {validSequences
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
                    return (
                      <div key={canvas.thumbnail['@id']} >
                        <img src={canvas.images[0].resource['@id']} style={{ pointer: 'zoom-in' }} />
                      </div>);
                  })}
              </div>
            ))}
        </div>
      }
      <div style={{ background: 'black', color: 'white', padding: '10px' }}>
        <span onClick={() => setShow('preview')}>Preview the book</span> | {' '}
        <span onClick={() => setShow('overview')}>View the whole book</span> | {' '}
        <span onClick={() => setShow('reading')}>Read the book</span>
      </div>

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
