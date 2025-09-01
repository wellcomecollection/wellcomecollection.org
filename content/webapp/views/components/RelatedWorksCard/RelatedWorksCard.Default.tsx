import NextLink from 'next/link';
import { FunctionComponent } from 'react';

import { convertIiifImageUri } from '@weco/common/utils/convert-image-uri';
import { DataGtmProps, dataGtmPropsToAttributes } from '@weco/common/utils/gtm';
import LabelsList from '@weco/common/views/components/LabelsList';
import { WorkBasic } from '@weco/content/services/wellcome/catalogue/types';
import { ContentApiLinkedWork } from '@weco/content/services/wellcome/content/types/api';
import { toWorkLink } from '@weco/content/views/components/WorkLink';

import { transformCardData } from './helpers';
import {
  Card,
  ImageWrapper,
  LineClamp,
  MetaContainer,
  TextWrapper,
  Title,
} from './RelatedWorksCard.styles';

export type Props = {
  work: WorkBasic | ContentApiLinkedWork; // Supports both Catalogue and Content API works
  gtmData?: DataGtmProps;
};

const RelatedWorksCard: FunctionComponent<Props> = ({ work, gtmData }) => {
  const { thumbnailUrl, date, mainContributor, labels } =
    transformCardData(work);

  return (
    <NextLink
      {...toWorkLink({ id: work.id })}
      data-component="related-works-card"
      style={{ textDecoration: 'none' }}
    >
      <Card
        as="span"
        {...(gtmData &&
          dataGtmPropsToAttributes({
            ...gtmData,
            id: work.id,
            trigger: 'related_card_result',
          }))}
      >
        <TextWrapper>
          <div>
            <LabelsList labels={labels} defaultLabelColor="warmNeutral.300" />
            <Title $linesToClamp={3}>{work.title}</Title>
          </div>

          <MetaContainer>
            {mainContributor && (
              <LineClamp $linesToClamp={1}>{mainContributor}</LineClamp>
            )}
            {date && <LineClamp $linesToClamp={1}>Date: {date}</LineClamp>}
          </MetaContainer>
        </TextWrapper>

        {thumbnailUrl && (
          <ImageWrapper>
            <img
              src={convertIiifImageUri(thumbnailUrl, 120)}
              alt={work.title}
              loading="lazy"
              width="200"
              height="200"
            />
          </ImageWrapper>
        )}
      </Card>
    </NextLink>
  );
};

export default RelatedWorksCard;
