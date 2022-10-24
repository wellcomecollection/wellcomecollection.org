import { FunctionComponent } from 'react';
import { WorkBasic } from 'services/catalogue/types/works';

// Helpers/Utils
import { convertIiifImageUri } from '@weco/common/utils/convert-image-uri';

// Components
import Space from '@weco/common/views/components/styled/Space';
import WorkTitle from '../WorkTitle/WorkTitle';
import WorkLink from '@weco/common/views/components/WorkLink/WorkLink';
import LabelsList from '@weco/common/views/components/LabelsList/LabelsList';
import {
  Container,
  Wrapper,
  Details,
  Preview,
  PreviewImage,
  WorkInformation,
  WorkInformationItem,
  WorkTitleHeading,
} from './WorksSearchResult.styles';
import { getCardLabels } from 'utils/works';

type Props = {
  work: WorkBasic;
  resultPosition: number;
};

// TODO: remove, hack to handle the fact that we are pulling through PDF thumbnails.
// These will be removed from the API at some stage.
function isPdfThumbnail(thumbnailUrl: string): boolean {
  // e.g. https://dlcs.io/iiif-img/wellcome/5/b28820769_WG_2006_PAAG-implementing-persistent-identifiers_EN.pdf/full/!200,200/0/default.jpg
  return Boolean(thumbnailUrl.match('.pdf/full'));
}

const WorkSearchResultV2: FunctionComponent<Props> = ({
  work,
  resultPosition,
}: Props) => {
  const cardLabels = getCardLabels(work.workType, work.availabilities);

  return (
    <WorkLink
      id={work.id}
      resultPosition={resultPosition}
      source="works_search_result"
      passHref
    >
      <Wrapper as="a">
        <Container>
          {work.thumbnailUrl && !isPdfThumbnail(work.thumbnailUrl) && (
            <Preview>
              <PreviewImage
                alt={`view ${work.title}`}
                src={convertIiifImageUri(work.thumbnailUrl, 120)}
              />
            </Preview>
          )}
          <Details>
            <Space v={{ size: 's', properties: ['margin-bottom'] }}>
              <LabelsList
                labels={cardLabels}
                defaultLabelColor="warmNeutral.300"
              />
            </Space>
            <WorkTitleHeading>
              <WorkTitle title={work.title} />
            </WorkTitleHeading>

            <WorkInformation>
              {work.primaryContributors.length > 0 && (
                <WorkInformationItem>
                  {work.primaryContributors[0].label}
                </WorkInformationItem>
              )}

              {work.productionDates.length > 0 && (
                <WorkInformationItem>
                  Date:&nbsp;{work.productionDates[0]}
                </WorkInformationItem>
              )}

              {work.reference && (
                <WorkInformationItem>
                  Reference:&nbsp;{work.reference}
                </WorkInformationItem>
              )}
            </WorkInformation>
            {work.partOf && (
              <WorkInformation>Part of:&nbsp;{work.partOf}</WorkInformation>
            )}
          </Details>
        </Container>
      </Wrapper>
    </WorkLink>
  );
};
export default WorkSearchResultV2;
