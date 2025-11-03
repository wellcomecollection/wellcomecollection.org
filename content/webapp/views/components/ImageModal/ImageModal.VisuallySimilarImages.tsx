import { FunctionComponent, useContext, useEffect, useState } from 'react';
import styled from 'styled-components';

import { ServerDataContext } from '@weco/common/server-data/Context';
import { font } from '@weco/common/utils/classnames';
import LL from '@weco/common/views/components/styled/LL';
import { plainListStyles } from '@weco/common/views/components/styled/PlainList';
import Space from '@weco/common/views/components/styled/Space';
import { getImage } from '@weco/content/services/wellcome/catalogue/images';
import { Image as ImageType } from '@weco/content/services/wellcome/catalogue/types';
import IIIFImage from '@weco/content/views/components/IIIFImage';

type Props = {
  originalId: string;
  onClickImage: (image: ImageType) => void;
};

type State = 'initial' | 'loading' | 'success' | 'failed';

const Wrapper = styled(Space).attrs({
  as: 'ul',
  $v: { size: 's', properties: ['margin-bottom', 'margin-top'] },
})`
  ${plainListStyles}

  display: flex;
  align-items: center;
  flex-wrap: wrap;
  min-height: 120px;

  ${props => props.theme.media('large')`
    flex-wrap: nowrap;
  `}

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

const VisuallySimilarImages: FunctionComponent<Props> = ({
  originalId,
  onClickImage,
}: Props) => {
  const [similarImages, setSimilarImages] = useState<ImageType[]>([]);
  const [requestState, setRequestState] = useState<State>('initial');
  const { toggles } = useContext(ServerDataContext);

  useEffect(() => {
    setRequestState('loading');
    const fetchVisuallySimilarImages = async () => {
      const { image: fullImage } = await getImage({
        id: originalId,
        toggles,
        include: ['withSimilarFeatures'],
      });
      if (fullImage.type === 'Image') {
        setSimilarImages(fullImage.withSimilarFeatures || []);
        setRequestState('success');
      } else {
        setRequestState('failed');
      }
    };
    fetchVisuallySimilarImages();
  }, [originalId]);

  if (requestState === 'loading' && !similarImages.length)
    return (
      <Space $v={{ size: 'xl', properties: ['margin-bottom', 'margin-top'] }}>
        <div style={{ height: '120px' }}>
          <LL $small $position="relative" />
        </div>
      </Space>
    );

  return similarImages.length === 0 ? null : (
    <>
      <h3 className={font('wb', 5)}>Visually similar images</h3>

      <Wrapper>
        {similarImages.map(related => (
          <li key={related.id}>
            <button
              style={{ padding: 0 }}
              onClick={() => {
                // We tried to use data attributes to send these values and pick them up with a
                // GTM clicked links trigger, but The onClickImage function below was updating the
                // originalId before it was sent (making the relatedId and originalId appear the same in GA).
                // By pushing to the dataLayer before onClickImage runs we can get round this.
                window.dataLayer?.push({
                  event: 'visually_similar_image_click',
                  visuallySimilarImage: {
                    relatedId: related.id,
                    originalId,
                    resultPosition:
                      similarImages.findIndex(s => s.id === related.id) + 1,
                  },
                });
                onClickImage(related);
              }}
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
            </button>
          </li>
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
export default VisuallySimilarImages;
