import { font, classNames } from '@weco/common/utils/classnames';
import Image from '@weco/common/views/components/Image/Image';
import { Image as ImageType } from '@weco/common/model/catalogue';
import { FunctionComponent, useEffect, useState } from 'react';
import styled from 'styled-components';
import {
  getImage,
  getVisuallySimilarImagesClientSide,
} from '../../services/catalogue/images';
import Space from '@weco/common/views/components/styled/Space';
import { useToggles } from '@weco/common/server-data/Context';

type Props = {
  originalId: string;
  onClickImage: (image: ImageType) => void;
};

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

const VisuallySimilarImagesFromApi: FunctionComponent<Props> = ({
  originalId,
  onClickImage,
}: Props) => {
  const [similarImages, setSimilarImages] = useState<ImageType[]>([]);
  const toggles = useToggles();

  useEffect(() => {
    const fetchVisuallySimilarImages = async () => {
      const fullImage = await getVisuallySimilarImagesClientSide(originalId);

      if (fullImage && fullImage.type === 'Image') {
        setSimilarImages(fullImage.visuallySimilar || []);
      }
    };

    fetchVisuallySimilarImages();
  }, [originalId]);
  return similarImages.length === 0 ? null : (
    <Space v={{ size: 'xl', properties: ['margin-bottom'] }}>
      <h3 className={font('wb', 5)}>Visually similar images</h3>
      <Wrapper>
        {similarImages.map(related => (
          <a href="#" onClick={() => onClickImage(related)} key={related.id}>
            <Image
              contentUrl={related.locations[0]?.url}
              defaultSize={250}
              width={250}
              alt=""
            />
          </a>
        ))}
      </Wrapper>
      <p
        className={classNames({
          [font('hnr', 6)]: true,
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
export default VisuallySimilarImagesFromApi;
