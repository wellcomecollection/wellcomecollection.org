import NextLink from 'next/link';
import { FunctionComponent } from 'react';

import { archive } from '@weco/common/icons';
import { convertIiifImageUri } from '@weco/common/utils/convert-image-uri';
import Icon from '@weco/common/views/components/Icon';
import LabelsList from '@weco/common/views/components/LabelsList';
import Space from '@weco/common/views/components/styled/Space';
import { toWorkLink } from '@weco/content/views/components/WorkLink';
import WorkTitle from '@weco/content/views/components/WorkTitle';

import type { WorkBasicWithArchive } from '.';
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
  work: WorkBasicWithArchive;
  resultPosition: number;
};

const WorkSearchResult: FunctionComponent<Props> = ({
  work,
  resultPosition,
}) => {
  const {
    isRootCollection,
    archiveLabels,
    cardLabels,
    physicalDescription,
    primaryContributorLabel,
    productionDates,
  } = work;

  return (
    <NextLink
      {...toWorkLink({ id: work.id })}
      style={{ textDecoration: 'none', display: 'inline-block' }}
    >
      <Wrapper
        data-gtm-trigger="works_search_result"
        data-gtm-position-in-list={resultPosition + 1}
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

            <WorkTitleHeading $isRootCollection={isRootCollection}>
              <WorkTitle title={work.title} />
            </WorkTitleHeading>

            {isRootCollection && (
              <Space $v={{ size: 'sm', properties: ['margin-bottom'] }}>
                Lorem ipsum dolor sit amet.
              </Space>
            )}

            <WorkInformation>
              {primaryContributorLabel && (
                <span className="searchable-selector">
                  {primaryContributorLabel}
                </span>
              )}

              {isRootCollection && (
                <>
                  <WorkInformationItemSeparator aria-hidden>
                    {' | '}
                  </WorkInformationItemSeparator>
                  <ArchiveIconWrapper>
                    <Icon icon={archive} matchText />
                  </ArchiveIconWrapper>
                  <span className="searchable-selector">
                    Archive Collection
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

            {isRootCollection && physicalDescription && (
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
