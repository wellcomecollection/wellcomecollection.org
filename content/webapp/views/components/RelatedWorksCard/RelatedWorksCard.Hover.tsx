import { FunctionComponent } from 'react';

import { convertIiifImageUri } from '@weco/common/utils/convert-image-uri';
import { DataGtmProps, dataGtmPropsToAttributes } from '@weco/common/utils/gtm';
import { WorkBasic } from '@weco/content/services/wellcome/catalogue/types';
import { ContentApiLinkedWork } from '@weco/content/services/wellcome/content/types/api';

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
  gtmData?: DataGtmProps;
};

const RelatedWorksCard: FunctionComponent<Props> = ({ work, gtmData }) => {
  const isCatalogueWork = 'notes' in work;

  const thumbnailUrl = isCatalogueWork
    ? work.thumbnail?.url
    : work.thumbnailUrl;

  const date = isCatalogueWork
    ? work.productionDates.length > 0
      ? work.productionDates[0]
      : undefined
    : work.date;

  const mainContributor = isCatalogueWork
    ? work.primaryContributorLabel
    : work.mainContributor;

  return (
    <div>
      <Card
        as="span"
        $isHover={true}
        {...(gtmData &&
          dataGtmPropsToAttributes({
            ...gtmData,
            id: work.id,
            trigger: 'related_card_result',
          }))}
      >
        {thumbnailUrl && (
          <ImageWrapper $isHover={true}>
            <img
              src={convertIiifImageUri(thumbnailUrl, 120)}
              alt={work.title}
              loading="lazy"
              width="200"
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
