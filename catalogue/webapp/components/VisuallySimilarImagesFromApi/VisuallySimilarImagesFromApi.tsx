import { font } from '@weco/common/utils/classnames';
import { Image as ImageType } from '@weco/common/model/catalogue';
import { FunctionComponent, useEffect, useState } from 'react';
import styled from 'styled-components';
import { getImage } from '../../services/catalogue/images';
import Space from '@weco/common/views/components/styled/Space';
import { useToggles } from '@weco/common/server-data/Context';
import IIIFImage from '../IIIFImage/IIIFImage';
import LL from '@weco/common/views/components/styled/LL';

type Props = {
  originalId: string;
  onClickImage: (image: ImageType) => void;
};

const Wrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  min-height: 120px;

  ${props => props.theme.media('medium')`
    flex-wrap: nowrap;
  `}

  img {
    margin-right: 10px;
    margin-bottom: 10px;
    height: auto;
    width: calc(100% - 10px);
    max-height: 120px;
    max-width: 190px;
  }
`;

const LoaderWrapper = styled.div`
  height: 120px;
`;

const VisuallySimilarImagesFromApi: FunctionComponent<Props> = ({
  originalId,
  onClickImage,
}: Props) => {
  const [similarImages, setSimilarImages] = useState<ImageType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const toggles = useToggles();

  useEffect(() => {
    const fetchVisuallySimilarImages = async () => {
      setIsLoading(true);
      const { image: fullImage } = await getImage({
        id: originalId,
        toggles,
        include: ['visuallySimilar'],
      });
      if (fullImage.type === 'Image') {
        setSimilarImages(fullImage.visuallySimilar || []);
      }
      setIsLoading(false);
    };
    fetchVisuallySimilarImages();
  }, [originalId]);

  if (isLoading && !similarImages.length)
    return (
      <Space v={{ size: 'xl', properties: ['margin-bottom', 'margin-top'] }}>
        <LoaderWrapper>
          <LL small positionRelative />
        </LoaderWrapper>
      </Space>
    );

  return similarImages.length === 0 ? null : (
    <>
      <h3 className={font('wb', 5)}>Visually similar images</h3>
      <Wrapper>
        {similarImages.map(related => (
          <a key={related.id} onClick={() => onClickImage(related)} href="#">
            <IIIFImage
              layout="raw"
              image={{
                contentUrl: related.locations[0]?.url,
                width: 180,
                height: 180,
                alt: '',
              }}
              width={180}
            />
          </a>
        ))}
      </Wrapper>
      <p className={`${font('intr', 6)} no-margin`}>
        These images have similar shapes and structural features. We use machine
        learning to detect visual similarity across all images in our
        collection.
      </p>
    </>
  );
};
export default VisuallySimilarImagesFromApi;
