// @flow
import { font, classNames } from '@weco/common/utils/classnames';
import NextLink from 'next/link';
import Image from '@weco/common/views/components/Image/Image';
import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { getSimilarImages } from '../../services/image-similarity';
import Space from '@weco/common/views/components/styled/Space';

type Props = {|
  originalId: string,
|};

const Wrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;

  img {
    margin-right: 10px;
    margin-bottom: 10px;
    height: auto;
    max-height: 120px;
    max-width: 190px;
    width: auto;
  }
`;

const VisuallySimilarImages = ({ originalId }: Props) => {
  const [similarImages, setSimilarImages] = useState([]);
  useEffect(() => {
    const fetchRelatedImages = async () =>
      setSimilarImages(
        await getSimilarImages({
          id: originalId,
          n: 5,
        })
      );
    fetchRelatedImages();
  }, []);
  return similarImages.length === 0 ? null : (
    <Space v={{ size: 'xl', properties: ['margin-bottom'] }}>
      <h3 className={font('wb', 5)}>Visually similar images</h3>
      <Wrapper>
        {similarImages.map(related => (
          <NextLink href={`/works/${related.workId}`} key={related.id}>
            <a>
              <Image
                contentUrl={related.uri}
                defaultSize={250}
                width={250}
                alt=""
                tasl={null}
              />
            </a>
          </NextLink>
        ))}
      </Wrapper>
      <p
        className={classNames({
          [font('hnl', 6)]: true,
          'no-margin': true,
        })}
      >
        These images have similar shapes and structural features. We use machine
        learning to detect visual similarity across all images in our
        collection.
      </p>
    </Space>
  );
};
export default VisuallySimilarImages;
