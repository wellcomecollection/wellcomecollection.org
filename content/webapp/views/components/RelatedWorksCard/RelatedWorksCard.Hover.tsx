import NextLink from 'next/link';
import { FunctionComponent } from 'react';

import { convertIiifImageUri } from '@weco/common/utils/convert-image-uri';
import { DataGtmProps, dataGtmPropsToAttributes } from '@weco/common/utils/gtm';
import { WorkBasic } from '@weco/content/services/wellcome/catalogue/types';
import { toWorkLink } from '@weco/content/views/components/WorkLink';
import { ContentAPILinkedWork } from '@weco/content/views/pages/stories/story/tempMockData';

import {
  Card,
  ImageWrapper,
  LineClamp,
  MetaContainer,
  TextWrapper,
  Title,
} from './RelatedWorksCard.styles';

type Props = {
  work: WorkBasic | ContentAPILinkedWork; // Supports both Catalogue and Content API works
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
    <NextLink
      {...toWorkLink({ id: work.id })}
      data-component="related-works-card"
      style={{ textDecoration: 'none' }}
    >
      <Card
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
          <Title $isHover={true} $linesToClamp={1}>
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
    </NextLink>
  );
};

export default RelatedWorksCard;
