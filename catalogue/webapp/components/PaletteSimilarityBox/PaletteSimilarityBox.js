// @flow
import { type Work } from '@weco/common/model/work';
import { useState, useEffect } from 'react';
import fetch from 'isomorphic-unfetch';

type Props = {|
  work: Work,
|};

const PaletteSimilarityBox = ({ work }: Props) => {
  const [similar, setSimilar] = useState();

  async function getSimilar(id) {
    const resp = await fetch(
      `https://labs.wellcomecollection.org/palette-api/works/${id}&n=5`
    );
    const similar = await resp.json();
    setSimilar(similar);
  }

  useEffect(() => {
    getSimilar(work.id);
  }, []);

  return similar ? (
    <div>
      <div className="flex">
        {similar.neighbours.map(neighbour => {
          return (
            <div
              style={{
                flex: '1 1 auto',
                marginRight: '5px',
              }}
              key={neighbour.uri}
            >
              <a href={neighbour.catalogue_uri}>
                <img
                  src={neighbour.miro_uri}
                  alt=""
                  style={{ maxWidth: '100%', width: 'auto' }}
                />
              </a>
            </div>
          );
        })}
      </div>
    </div>
  ) : null;
};

export default PaletteSimilarityBox;
