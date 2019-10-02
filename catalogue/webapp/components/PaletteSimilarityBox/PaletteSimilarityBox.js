// @flow
import { type Work } from '@weco/common/model/work';
import { useState, useEffect } from 'react';
import fetch from 'isomorphic-unfetch';

type Props = {|
  work: Work,
|};

const PaletteSimilarityBox = ({ work }: Props) => {
  const [similar, setSimilar] = useState();

  const miroNumber = (
    work.identifiers.find(
      identifier => identifier.identifierType.id === 'miro-image-number'
    ) || {}
  ).value;

  async function getSimilar(id) {
    const resp = await fetch(
      `https://labs.wellcomecollection.org/palette-api/by_image_id?image_id=${id}&n=5`
    );
    const similar = await resp.json();
    setSimilar(similar);
  }

  useEffect(() => {
    if (miroNumber) {
      getSimilar(miroNumber);
    }
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
              {/* Woohoo, is this hacky, but we need it as we only have the miro image */}
              <a
                href={`https://wellcomeimages.org/redirect?query=${neighbour.id}`}
              >
                <img
                  src={`${neighbour.uri}`}
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
