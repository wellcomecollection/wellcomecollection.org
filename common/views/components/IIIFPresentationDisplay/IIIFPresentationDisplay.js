// @flow
import fetch from 'isomorphic-unfetch';
import {useState, useEffect} from 'react';
import SegmentedControl from '@weco/common/views/components/SegmentedControl/SegmentedControl';
import Icon from '../Icon/Icon';

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

  // Search
  const [searchService, setSearchService] = useState(null);
  const [searchResults, setSearchResults] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetch(manifestLocation).then(resp => resp.json()).then(json => {
      setManifestData(json);
      const maybeSearchService = json.service.find(service => {
        return service['@context'] === 'http://iiif.io/api/search/0/context.json';
      });

      if (maybeSearchService) {
        setSearchService(maybeSearchService);
      }
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
      {searchService &&
        <div>
          <form
            onSubmit={async (event) => {
              event.preventDefault();
              const searchUrl = searchService['@id'];
              const searchResultsResponse = await fetch(`${searchUrl}?q=${searchQuery}`).then(resp => resp.json());
              console.info(searchResultsResponse);
              setSearchResults(searchResultsResponse);
            }}>
            <input
              value={searchQuery}
              type='text'
              onChange={(event) => setSearchQuery(event.currentTarget.value)} />
          </form>
        </div>
      }
      {searchResults &&
        <div>
          <div>
            {searchResults.within.total} results for {'`'}{searchQuery}{'`'}
          </div>
          {searchResults.hits.map(hit => {
            return (
              <div className='flex' key={hit.annotations[0]}>
                <span className='margin-right-s1'>...</span>
                <p>
                  <span>{hit.before}</span>
                  <span className={'font-green'}><b>{hit.match}</b></span>
                  <span>{hit.after}</span>
                </p>
              </div>
            );
          })}
        </div>
      }

      {(show === 'overview' || show === 'reading') &&
        <div style={{
          marginBottom: '6px',
          position: 'sticky',
          top: 0
        }}>
          <SegmentedControl
            id={'testing_reading_vi'}
            activeId={null}
            onActiveIdChange={ id => setShow(id) }
            items={[{
              id: 'overview',
              url: '#',
              text: 'Overview'
            }, {
              id: 'reading',
              url: '#',
              text: 'Reading view'
            }]}
          />
        </div>
      }

      {show === 'preview' &&
        <div>
          <div style={{
            display: 'block'
          }}>
            <div style={{
              display: 'flex',
              maxWidth: '100%',
              overflow: 'scroll',
              justifyContent: 'space-between',
              position: 'relative',
              cursor: 'pointer'
            }} onClick={() => setShow('overview')}>

              {structuredCanvasesWithLabel && structuredCanvasesWithLabel
                .filter(structuredCanvaseWithLabel => structuredCanvaseWithLabel.label !== 'Back Cover')
                .map((structuredCanvas, i) => {
                  return structuredCanvas.canvases.map((canvas) => {
                    return (
                      <div
                        key={canvas.thumbnail['@id']}
                        style={{
                          position: 'relative',
                          paddingLeft: i === 0 ? '0' : '6px'
                        }}>
                        <img src={canvas.images[0].resource['@id']} style={{ position: 'relative' }} />
                      </div>
                    );
                  });
                })}

              <div style={{
                position: 'absolute',
                background: 'rgba(1,1,1,.85)',
                zIndex: 1,
                color: 'white',
                padding: '24px 96px',
                top: '50%',
                right: '0',
                transform: 'translateY(-50%)',
                borderTopLeftRadius: '12px',
                borderBottomRightRadius: '12px'
              }}>
                <div className='flex' style={{ alignItems: 'center' }}>
                  <b>View the book</b>
                  <Icon name='arrow' extraClasses='icon--white margin-left-s1' />
                </div>
              </div>
            </div>
          </div>
        </div>
      }
      {show === 'overview' &&
        <div style={{
          height: '80vh',
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
                  .map((canvas, i) => {
                    return (
                      <div key={canvas.thumbnail['@id']} style={{
                        paddingLeft: i === 0 ? '0' : '6px'
                      }}><img src={canvas.thumbnail['@id']} /></div>
                    );
                  })}
              </div>
            ))
          }
        </div>
      }
      {show === 'reading' &&
        <div style={{
          height: '80vh',
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
                  .slice(0, 20)
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
