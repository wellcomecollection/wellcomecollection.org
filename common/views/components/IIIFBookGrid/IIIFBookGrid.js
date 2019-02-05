// @flow
import type { IIIFSequence } from '../../../model/iiif';
import { Fragment } from 'react';

type Props = {|
  sequences: IIIFSequence[],
|};

const IIIFBookGrid = ({ sequences }: Props) => {
  return (
    <Fragment>
      {sequences.map(sequence => (
        <div
          key={sequence['@id']}
          style={{
            display: 'flex',
            maxWidth: '100%',
            flexWrap: 'wrap',
          }}
        >
          {sequence.canvases.map(canvas => {
            return (
              <div key={canvas.thumbnail['@id']}>
                <img src={canvas.thumbnail['@id']} />
              </div>
            );
          })}
        </div>
      ))}
    </Fragment>
  );
};
export default IIIFBookGrid;
