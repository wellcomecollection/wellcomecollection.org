// @flow
import { font } from '@weco/common/utils/classnames';
import NextLink from 'next/link';
import Image from '@weco/common/views/components/Image/Image';
import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { getSimilarImages } from '../../services/image-similarity';

type Props = {|
  originalId: string,
|};

const Wrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  margin-bottom: 40px;

  img {
    margin-right: 10px;
    margin-bottom: 10px;
    height: auto;
    max-height: 120px;
    max-width: 190px;
    width: auto;
  }
`;

const RelatedImages = ({ originalId }: Props) => {
  const [relatedImages, setRelatedImages] = useState([]);
  useEffect(() => {
    const fetchRelatedImages = async () =>
      setRelatedImages(
        await getSimilarImages({
          id: originalId,
          n: 6,
        })
      );
    fetchRelatedImages();
  }, []);
  return relatedImages.length === 0 ? null : (
    <>
      <h3 className={font('wb', 5)}>Visually similar images</h3>
      <Wrapper>
        {relatedImages.map(related => (
          <NextLink href={`/works/${related.id}`} key={related.id}>
            <a>
              <Image
                contentUrl={related.miroUri}
                defaultSize={250}
                width={250}
                alt=""
                tasl={null}
              />
            </a>
          </NextLink>
        ))}
      </Wrapper>
    </>
  );
};
export default RelatedImages;
