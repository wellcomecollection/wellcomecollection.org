// @flow
import ImageViewer from '@weco/common/views/components/ImageViewer/ImageViewer';
import type { IIIFSequence } from '../../../model/iiif';

type Props = {|
  sequences: IIIFSequence[]
|}

const IIIFBookReader = ({
  sequences
}: Props) => (
  <div>
    {sequences
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
              return (<div key={canvas.thumbnail['@id']} style={{position: 'relative', 'marginBottom': 30}}>
                <ImageViewer
                  contentUrl={canvas.images[0].resource['@id']}
                  infoUrl={`${canvas.images[0].resource.service['@id']}/info.json`}
                  id={canvas.images[0].resource['@id']}
                  width={800}/>
              </div>);
            })}
        </div>
      ))}
  </div>
);
export default IIIFBookReader;
