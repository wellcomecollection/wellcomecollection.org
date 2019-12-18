// @flow
import { type Work } from '@weco/common/model/work';
import { useState, useEffect } from 'react';
import type { SimilarImage } from '../../services/image-similarity';
import { getSimilarImages } from '../../services/image-similarity';

type Props = {|
  work: Work,
|};

const PaletteSimilarityBox = ({ work }: Props) => {
  const [similar, setSimilar] = useState<SimilarImage[]>([]);

  async function getSimilar(id) {
    setSimilar(await getSimilarImages({ id, measure: 'palette' }));
  }

  useEffect(() => {
    getSimilar(work.id);
  }, []);

  return similar ? (
    <div>
      <div className="flex">
        {similar.map(image => {
          return (
            <div
              style={{
                flex: '1 1 auto',
                marginRight: '5px',
              }}
              key={image.id}
            >
              <a href={image.workUri}>
                <img
                  src={image.miroUri}
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
