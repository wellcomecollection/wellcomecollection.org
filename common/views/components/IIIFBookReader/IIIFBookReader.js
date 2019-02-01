// @flow
type Props = {|
  sequences: any // TODO: Update when we have the IIIF model merged
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
              return (<div key={canvas.thumbnail['@id']} ><img src={canvas.images[0].resource['@id']} /></div>);
            })}
        </div>
      ))}
  </div>
);
export default IIIFBookReader;
