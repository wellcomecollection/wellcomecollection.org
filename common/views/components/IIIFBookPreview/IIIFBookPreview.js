// @flow
import type {IIIFCanvas} from '../../../model/iiif';
type Props = {|
  structuredCanvasesWithLabel: {|
    label: string,
    canvases: IIIFCanvas[]
  |}[]
|}

const IIIFBookPreview = ({
  structuredCanvasesWithLabel
}: Props) => (
  <div>
    <div style={{
      display: 'inline-block'
    }}>
      <div>
        {structuredCanvasesWithLabel.map(structuredCanvas => {
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

);
export default IIIFBookPreview;
