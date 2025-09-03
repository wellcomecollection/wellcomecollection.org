import { FunctionComponent } from 'react';

import { convertIiifImageUri } from '@weco/common/utils/convert-image-uri';
import { WorkBasic } from '@weco/content/services/wellcome/catalogue/types';
import { ContentApiLinkedWork } from '@weco/content/services/wellcome/content/types/api';

import { transformCardData } from './helpers';
import {
  Card,
  ImageWrapper,
  LineClamp,
  MetaContainer,
  TextWrapper,
  Title,
} from './RelatedWorksCard.styles';

type Props = {
  work: WorkBasic | ContentApiLinkedWork; // Supports both Catalogue and Content API works
};

const RelatedWorksCard: FunctionComponent<Props> = ({ work }) => {
  const { thumbnailUrl, date, mainContributor } = transformCardData(work);

  return (
    <div
      style={{ textAlign: 'left' }}
      data-component="related-works-card-hover"
    >
      <Card as="span" $isHover={true}>
        {thumbnailUrl && (
          <ImageWrapper $isHover={true}>
            <img
              src={convertIiifImageUri(thumbnailUrl, 250)}
              alt={work.title}
              loading="lazy"
              height="200"
            />
          </ImageWrapper>
        )}
        <TextWrapper>
          <Title as="span" $isHover={true} $linesToClamp={1}>
            {work.title}
          </Title>

          <MetaContainer>
            {mainContributor && (
              <LineClamp $linesToClamp={1}>{mainContributor}</LineClamp>
            )}
            {date && <LineClamp $linesToClamp={1}>Date: {date}</LineClamp>}
          </MetaContainer>
        </TextWrapper>
      </Card>
    </div>
  );
};

export default RelatedWorksCard;
