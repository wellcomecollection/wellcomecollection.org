import { FunctionComponent, useEffect, useState } from 'react';
import styled from 'styled-components';

import { font } from '@weco/common/utils/classnames';
import { Image as ImageType } from '@weco/catalogue/services/wellcome/catalogue/types';
import { getImage } from '@weco/catalogue/services/wellcome/catalogue/images';
import Space from '@weco/common/views/components/styled/Space';
import { useToggles } from '@weco/common/server-data/Context';
import IIIFImage from '@weco/catalogue/components/IIIFImage/IIIFImage';
import LL from '@weco/common/views/components/styled/LL';
import { trackSegmentEvent } from '@weco/common/services/conversion/track';

type Props = {
  originalId: string;
  onClickImage: (image: ImageType) => void;
};

type State = 'initial' | 'loading' | 'success' | 'failed';

const Wrapper = styled(Space).attrs({
  v: { size: 's', properties: ['margin-bottom', 'margin-top'] },
})`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  min-height: 120px;

  ${props => props.theme.media('large')`
    flex-wrap: nowrap;
  `}

  a {
    flex: 1 0 auto;

    ${props => props.theme.media('medium')`
      flex: 0 1 auto;
    `}
  }

  img {
    margin-right: 10px;
    width: auto;
    max-height: 120px;

    /* Safari doesn't respond to max-height/width like the other browsers, we need this to ensure it's not warped. */
    object-fit: contain;

    ${props => props.theme.media('large')`
      max-width: 150px;
      width: calc(100% - 10px);
    `};
  }
`;

const LoaderWrapper = styled.div`
  height: 120px;
`;

const SectionTitle = styled.h3.attrs({
  className: font('wb', 5),
})`
  color: ${props => props.theme.color('black')};
`;

const VisuallySimilarImagesFromApi: FunctionComponent<Props> = ({
  originalId,
  onClickImage,
}: Props) => {
  const [similarImages, setSimilarImages] = useState<ImageType[]>([]);
  const [requestState, setRequestState] = useState<State>('initial');
  const toggles = useToggles();

  useEffect(() => {
    setRequestState('loading');
    const fetchVisuallySimilarImages = async () => {
      const { image: fullImage } = await getImage({
        id: originalId,
        toggles,
        include: ['visuallySimilar'],
      });
      if (fullImage.type === 'Image') {
        setSimilarImages(fullImage.visuallySimilar || []);
        setRequestState('success');
      } else {
        setRequestState('failed');
      }
    };
    fetchVisuallySimilarImages();
  }, [originalId]);

  if (requestState === 'loading' && !similarImages.length)
    return (
      <Space v={{ size: 'xl', properties: ['margin-bottom', 'margin-top'] }}>
        <LoaderWrapper>
          <LL small position="relative" />
        </LoaderWrapper>
      </Space>
    );

  return similarImages.length === 0 ? null : (
    <>
      <SectionTitle>Visually similar images</SectionTitle>

      <Wrapper>
        {similarImages.map(related => (
          <a
            key={related.id}
            onClick={() => {
              onClickImage(related);

              trackSegmentEvent({
                name: 'Click visually similar image',
                eventGroup: 'similarity',
                properties: {
                  sourceImageId: originalId,
                  imageId: related?.id,
                  siblingImageIds: similarImages.map(s => s.id),
                },
              });
            }}
            href="#"
          >
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
      <p className={font('intr', 6)} style={{ marginBottom: 0 }}>
        We use machine learning to find images in our collection with similar
        shapes and features.
        <br />
        <a href="mailto:digital@wellcomecollection.org?subject=Visually similar images feedback">
          Let us know
        </a>{' '}
        if something doesn&rsquo;t look right.
      </p>
    </>
  );
};
export default VisuallySimilarImagesFromApi;
