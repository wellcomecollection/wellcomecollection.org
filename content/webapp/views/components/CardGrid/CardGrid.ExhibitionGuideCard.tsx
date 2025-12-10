import { FunctionComponent } from 'react';

import linkResolver from '@weco/common/services/prismic/link-resolver';
import { font } from '@weco/common/utils/classnames';
import PrismicImage from '@weco/common/views/components/PrismicImage';
import Space from '@weco/common/views/components/styled/Space';
import {
  ExhibitionGuideBasic,
  ExhibitionGuideType,
} from '@weco/content/types/exhibition-guides';
import {
  CardBody,
  CardImageWrapper,
  CardOuter,
  CardTitle,
} from '@weco/content/views/components/Card';
import RelevantGuideIcons from '@weco/content/views/components/ExhibitionGuideRelevantIcons';
type Props = {
  exhibitionGuide: ExhibitionGuideBasic;
};

const getAvailableTypes = availableTypes => {
  const availableTypesArray: ExhibitionGuideType[] = [];

  if (availableTypes.audioWithoutDescriptions)
    availableTypesArray.push('audio-without-descriptions');
  if (availableTypes.BSLVideo) availableTypesArray.push('bsl');
  if (availableTypes.captionsOrTranscripts)
    availableTypesArray.push('captions-and-transcripts');

  return availableTypesArray;
};

const ExhibitionGuideCard: FunctionComponent<Props> = ({ exhibitionGuide }) => {
  return (
    <CardOuter
      href={exhibitionGuide.promo?.link || linkResolver(exhibitionGuide)}
    >
      {exhibitionGuide.promo?.image && (
        <CardImageWrapper>
          <PrismicImage
            // We intentionally omit the alt text on promos, so screen reader
            // users don't have to listen to the alt text before hearing the
            // title of the item in the list.
            image={{
              ...exhibitionGuide.promo.image,
              alt: '',
            }}
            sizes={{
              lg: 1 / 4,
              md: 1 / 3,
              sm: 1 / 2,
              zero: 1,
            }}
            quality="low"
          />
        </CardImageWrapper>
      )}

      <CardBody>
        <div>
          <CardTitle>{exhibitionGuide.title}</CardTitle>
          {exhibitionGuide.promo?.caption && (
            <Space $v={{ size: 'xs', properties: ['margin-top'] }}>
              <p className={font('sans', -1)} style={{ marginBottom: 0 }}>
                {exhibitionGuide.promo.caption}
              </p>
            </Space>
          )}
          <Space
            $v={{
              size: 'md',
              properties: ['margin-top'],
              overrides: { zero: 4, sm: 4, md: 5 },
            }}
          >
            <RelevantGuideIcons
              types={getAvailableTypes(exhibitionGuide.availableTypes)}
            />
          </Space>
        </div>
      </CardBody>
    </CardOuter>
  );
};

export default ExhibitionGuideCard;
