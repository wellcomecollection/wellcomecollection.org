import NextLink from 'next/link';
import { FunctionComponent } from 'react';

import { archive } from '@weco/common/icons';
import { useFeatureFlags } from '@weco/common/server-data/Context';
import { convertIiifImageUri } from '@weco/common/utils/convert-image-uri';
import { dataGtmPropsToAttributes } from '@weco/common/utils/gtm';
import Icon from '@weco/common/views/components/Icon';
import LabelsList from '@weco/common/views/components/LabelsList';
import Space from '@weco/common/views/components/styled/Space';
import type { WorkBasic } from '@weco/content/services/wellcome/catalogue/types';
import { toWorkLink } from '@weco/content/views/components/WorkLink';
import WorkTitle from '@weco/content/views/components/WorkTitle';

import {
  ArchiveIconWrapper,
  Container,
  Details,
  Preview,
  PreviewImage,
  WorkInformation,
  WorkInformationItemSeparator,
  WorkTitleHeading,
  Wrapper,
} from './WorksSearchResults.styles';

type Props = {
  work: WorkBasic;
  resultPosition: number;
};

const WorkSearchResult: FunctionComponent<Props> = ({
  work,
  resultPosition,
}) => {
  const { archiveBrowsing } = useFeatureFlags();
  const {
    isRootCollection,
    archiveLabels,
    cardLabels,
    physicalDescription,
    primaryContributorLabel,
    productionDates,
  } = work;

  const shouldShowArchiveCollectionInfo = archiveBrowsing && isRootCollection;

  return (
    <NextLink
      {...toWorkLink({ id: work.id })}
      style={{ textDecoration: 'none', display: 'inline-block' }}
    >
      <Wrapper
        {...dataGtmPropsToAttributes({
          trigger: 'works_search_result',
          'position-in-list': `${resultPosition + 1}`,
        })}
      >
        <Container>
          {work.thumbnail && (
            <Preview>
              <PreviewImage
                alt=""
                src={convertIiifImageUri(work.thumbnail.url, 120)}
              />
            </Preview>
          )}

          <Details>
            {cardLabels.length > 0 && (
              <Space $v={{ size: 'xs', properties: ['margin-bottom'] }}>
                <LabelsList
                  labels={cardLabels}
                  defaultLabelColor="warmNeutral.300"
                />
              </Space>
            )}

            <WorkTitleHeading
              $isRootCollection={shouldShowArchiveCollectionInfo}
            >
              <WorkTitle title={work.title} />
            </WorkTitleHeading>

            {shouldShowArchiveCollectionInfo && (
              <Space $v={{ size: 'sm', properties: ['margin-bottom'] }}>
                Lorem ipsum dolor sit amet.
              </Space>
            )}

            <WorkInformation>
              {shouldShowArchiveCollectionInfo && (
                <>
                  <ArchiveIconWrapper>
                    <Icon icon={archive} matchText />
                  </ArchiveIconWrapper>
                  <span className="searchable-selector">
                    Archive Collection
                  </span>
                </>
              )}

              {primaryContributorLabel && (
                <>
                  <WorkInformationItemSeparator aria-hidden>
                    {' | '}
                  </WorkInformationItemSeparator>
                  <span className="searchable-selector">
                    {primaryContributorLabel}
                  </span>
                </>
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

            {shouldShowArchiveCollectionInfo && physicalDescription && (
              <WorkInformation $isSmall>
                Archive Collection contains: {physicalDescription}
              </WorkInformation>
            )}
          </Details>
        </Container>
      </Wrapper>
    </NextLink>
  );
};
export default WorkSearchResult;
