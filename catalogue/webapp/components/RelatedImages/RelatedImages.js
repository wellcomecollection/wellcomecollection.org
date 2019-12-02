// @flow
import { font } from '@weco/common/utils/classnames';
import Image from '@weco/common/views/components/Image/Image';
import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { getSimilarPaletteImages } from '../../services/labs/palette-api';

type Props = {|
  originalId: string,
|};

const Wrapper = styled.div`
  padding-top: 40px;
  width: 100%;
`;

const Images = styled.div`
  display: flex;
  align-items: flex-end;
  overflow: hidden;
  max-height: 250px;
  min-height: 100px;
`;

const ImageWrapper = styled.div`
  padding-right: 20px;
  &:last-of-type {
    padding-right: 0;
  }
`;

const RelatedImages = ({ originalId }: Props) => {
  const [relatedImages, setRelatedImages] = useState([]);
  useEffect(() => {
    const fetchRelatedImages = async () =>
      setRelatedImages(await getSimilarPaletteImages(originalId));
    fetchRelatedImages();
  }, []);
  return (
    <Wrapper>
      <h3 className={font('hnm', 4)}>Related images</h3>
      <Images>
        {relatedImages.map(related => (
          <ImageWrapper key={related.id}>
            <Image
              contentUrl={related.miroUri}
              defaultSize={100}
              width={100}
              alt="foo"
              tasl={null}
            />
          </ImageWrapper>
        ))}
      </Images>
    </Wrapper>
  );
};

export default RelatedImages;
