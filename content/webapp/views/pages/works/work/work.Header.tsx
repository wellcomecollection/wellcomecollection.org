import { FunctionComponent } from 'react';
import styled from 'styled-components';

import { font } from '@weco/common/utils/classnames';
import Divider from '@weco/common/views/components/Divider';
import LabelsList from '@weco/common/views/components/LabelsList';
import { Grid, GridCell } from '@weco/common/views/components/styled/Grid';
import Space from '@weco/common/views/components/styled/Space';
import SpacingComponent from '@weco/common/views/components/styled/SpacingComponent';
import LinkLabels from '@weco/content/views/components/LinkLabels';
import Number from '@weco/content/views/components/Number';
import WorkTitle from '@weco/content/views/components/WorkTitle';
import { useIsArchiveContext } from '@weco/content/contexts/IsArchiveContext';
import { WorkBasic } from '@weco/content/services/wellcome/catalogue/types';
const WorkTitleWrapper = styled.h1.attrs({ className: font('intb', 2) })`
  margin: 0;
  display: inline-block;
`;

type Props = {
  work: WorkBasic;
  collectionManifestsCount: number | undefined;
};

const WorkHeader: FunctionComponent<Props> = ({
  work,
  collectionManifestsCount,
}) => {
  const isArchive = useIsArchiveContext();
  const {
    productionDates,
    archiveLabels,
    cardLabels,
    primaryContributorLabel,
    languageId,
  } = work;

  return (
    <>
      <Grid>
        <GridCell
          $sizeMap={{
            s: [12],
            m: [12],
            l: [10],
            xl: [10],
          }}
        >
          <Space $v={{ size: 'm', properties: ['margin-bottom'] }}>
            <SpacingComponent>
              <WorkTitleWrapper
                aria-live="polite"
                id="work-info"
                lang={languageId}
              >
                <WorkTitle title={work.title} />
              </WorkTitleWrapper>

              {primaryContributorLabel && (
                <Space $h={{ size: 'm', properties: ['margin-right'] }}>
                  <LinkLabels items={[{ text: primaryContributorLabel }]} />
                </Space>
              )}

              {productionDates.length > 0 && (
                <LinkLabels
                  heading="Date"
                  items={[{ text: productionDates[0] }]}
                />
              )}

              {work.referenceNumber && (
                <LinkLabels
                  heading="Reference"
                  items={[{ text: work.referenceNumber }]}
                />
              )}

              {archiveLabels?.partOf && (
                <LinkLabels
                  heading="Part of"
                  items={[{ text: archiveLabels.partOf }]}
                />
              )}

              {cardLabels.length > 0 && (
                <Space
                  $v={{
                    size: 'm',
                    properties: ['margin-top'],
                  }}
                >
                  <LabelsList
                    labels={cardLabels}
                    defaultLabelColor="warmNeutral.300"
                  />
                </Space>
              )}

              {Boolean(
                collectionManifestsCount && collectionManifestsCount > 0
              ) && (
                <Space $v={{ size: 'm', properties: ['margin-top'] }}>
                  <p className={font('intb', 5)} style={{ marginBottom: 0 }}>
                    <Number
                      backgroundColor="yellow"
                      number={collectionManifestsCount as number}
                    />
                    {collectionManifestsCount === 1 ? ' volume ' : ' volumes '}
                    online
                  </p>
                </Space>
              )}
            </SpacingComponent>
          </Space>
        </GridCell>
      </Grid>
      {!isArchive && (
        <Space $v={{ size: 'm', properties: ['margin-bottom'] }}>
          <Divider lineColor="neutral.400" />
        </Space>
      )}
    </>
  );
};
export default WorkHeader;
