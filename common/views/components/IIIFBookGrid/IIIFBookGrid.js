// @flow
type Props = {|
  sequences: any // TODO: Update when we have the IIIF model merged
|}

const IIIFBookGrid = ({
  sequences
}: Props) => {
  return sequences.map(sequence =>
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
  );
};
export default IIIFBookGrid;
