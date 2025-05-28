import { usePathname } from 'next/navigation';
import { FunctionComponent } from 'react';

import { DigitalLocation } from '@weco/common/model/catalogue';
import { convertIiifImageUri } from '@weco/common/utils/convert-image-uri';
import LabelsList from '@weco/common/views/components/LabelsList';
import Space from '@weco/common/views/components/styled/Space';
import WorkLink from '@weco/content/components/WorkLink';
import WorkTitle from '@weco/content/components/WorkTitle';
import { WorkBasic } from '@weco/content/services/wellcome/catalogue/types';

import {
  Container,
  Details,
  Preview,
  PreviewImage,
  WorkInformation,
  WorkInformationItemSeparator,
  WorkTitleHeading,
  Wrapper,
} from './WorksSearchResult.styles';

type Props = {
  work: WorkBasic;
  resultPosition: number;
};

// TODO: remove, hack to handle the fact that we are pulling through PDF thumbnails.
// These will be removed from the API at some stage.
function isPdfThumbnail(thumbnail: DigitalLocation): boolean {
  // e.g. https://dlcs.io/iiif-img/wellcome/5/b28820769_WG_2006_PAAG-implementing-persistent-identifiers_EN.pdf/full/!200,200/0/default.jpg
  return Boolean(thumbnail.url.match('.pdf/full'));
}

const WorkSearchResult: FunctionComponent<Props> = ({
  work,
  resultPosition,
}) => {
  const {
    productionDates,
    archiveLabels,
    cardLabels,
    primaryContributorLabel,
  } = work;
  const pathname = usePathname();

  return (
    <WorkLink
      id={work.id}
      resultPosition={resultPosition}
      source={`works_search_result_${pathname}`}
      passHref
    >
      <Wrapper
        as="a"
        data-gtm-trigger="search_result"
        data-gtm-position-in-list={resultPosition + 1}
      >
        <Container>
          {work.thumbnail && !isPdfThumbnail(work.thumbnail) && (
            <Preview>
              <PreviewImage
                alt=""
                src={convertIiifImageUri(work.thumbnail.url, 120)}
              />
            </Preview>
          )}
          <Details>
            {cardLabels.length > 0 && (
              <Space $v={{ size: 's', properties: ['margin-bottom'] }}>
                <LabelsList
                  labels={cardLabels}
                  defaultLabelColor="warmNeutral.300"
                />
              </Space>
            )}
            <WorkTitleHeading>
              <WorkTitle title={work.title} />
            </WorkTitleHeading>

            <WorkInformation>
              {primaryContributorLabel && (
                <span className="searchable-selector">
                  {primaryContributorLabel}
                </span>
              )}

              {productionDates.length > 0 && (
                <>
                  <WorkInformationItemSeparator aria-hidden>
                    {' | '}
                  </WorkInformationItemSeparator>
                  <span className="searchable-selector">
                    Date:&nbsp;{productionDates[0]}
                  </span>
                </>
              )}

              {archiveLabels?.reference && (
                <>
                  <WorkInformationItemSeparator aria-hidden>
                    {' | '}
                  </WorkInformationItemSeparator>
                  <span>Reference:&nbsp;{archiveLabels?.reference}</span>
                </>
              )}
            </WorkInformation>
            {archiveLabels?.partOf && (
              <WorkInformation>
                Part of:&nbsp;{archiveLabels?.partOf}
              </WorkInformation>
            )}
          </Details>
        </Container>
      </Wrapper>
    </WorkLink>
  );
};
export default WorkSearchResult;
