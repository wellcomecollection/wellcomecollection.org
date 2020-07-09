// @flow
import { font, classNames } from '@weco/common/utils/classnames';
import Image from '@weco/common/views/components/Image/Image';
import { type Image as ImageType } from '@weco/common/model/catalogue';
import TogglesContext from '@weco/common/views/components/TogglesContext/TogglesContext';
import { useContext, useEffect, useState } from 'react';
import styled from 'styled-components';
import { getImage } from '../../services/catalogue/images';
import Space from '@weco/common/views/components/styled/Space';

type Props = {|
  originalId: string,
  onClickImage: (image: ImageType) => void,
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

const VisuallySimilarImagesFromApi = ({ originalId, onClickImage }: Props) => {
  const [similarImages, setSimilarImages] = useState<ImageType[]>([]);
  const toggles = useContext(TogglesContext);
  useEffect(() => {
    const fetchVisuallySimilarImages = async () => {
      const fullImage = await getImage({ id: originalId, toggles });
      setSimilarImages(fullImage.visuallySimilar);
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
              contentUrl={related.locations[0] && related.locations[0].url}
              defaultSize={250}
              width={250}
              alt=""
              tasl={null}
            />
          </a>
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
export default VisuallySimilarImagesFromApi;
