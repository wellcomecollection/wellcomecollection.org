import { FunctionComponent, ReactElement } from 'react';
import { Work } from '@weco/common/model/catalogue';
import { font, grid } from '@weco/common/utils/classnames';
import {
  getProductionDates,
  getArchiveLabels,
  getCardLabels,
} from '../../utils/works';
import SpacingComponent from '@weco/common/views/components/SpacingComponent/SpacingComponent';
import LinkLabels from '@weco/common/views/components/LinkLabels/LinkLabels';
import Space from '@weco/common/views/components/styled/Space';
import Number from '@weco/common/views/components/Number/Number';
import styled from 'styled-components';
import WorkTitle from '../WorkTitle/WorkTitle';
import LabelsList from '@weco/common/views/components/LabelsList/LabelsList';
import useIIIFManifestData from '../../hooks/useIIIFManifestData';

const WorkHeaderContainer = styled.div.attrs({
  className: 'flex',
})`
  width: 100%;
  align-content: flex-start;
`;

type Props = {
  work: Work;
};

const WorkHeader: FunctionComponent<Props> = ({
  work,
}: Props): ReactElement<Props> => {
  const productionDates = getProductionDates(work);
  const archiveLabels = getArchiveLabels(work);
  const cardLabels = getCardLabels(work);
  const { childManifestsCount } = useIIIFManifestData(work);

  const primaryContributorLabel = work.contributors.find(
    contributor => contributor.primary
  )?.agent.label;

  return (
    <WorkHeaderContainer>
      <Space
        v={{
          size: 'm',
          properties: ['margin-bottom'],
        }}
        className={grid({ s: 12, m: 12, l: 10, xl: 10 })}
      >
        <SpacingComponent>
          <h1
            aria-live="polite"
            id="work-info"
            className={`no-margin ${font('intb', 2)} inline-block`}
            // We only send a lang if it's unambiguous -- better to send
            // no language than the wrong one.
            lang={
              work?.languages?.length === 1 ? work?.languages[0]?.id : undefined
            }
          >
            <WorkTitle title={work.title} />
          </h1>

          {primaryContributorLabel && (
            <Space h={{ size: 'm', properties: ['margin-right'] }}>
              <LinkLabels
                items={[
                  {
                    text: primaryContributorLabel,
                    url: null,
                  },
                ]}
              />
            </Space>
          )}

          {productionDates.length > 0 && (
            <LinkLabels
              heading={'Date'}
              items={[
                {
                  text: productionDates[0],
                  url: null,
                },
              ]}
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

          <Space
            v={{
              size: 'm',
              properties: ['margin-top'],
            }}
          >
            <LabelsList labels={cardLabels} defaultLabelColor="cream" />
          </Space>

          {childManifestsCount > 0 && (
            <Space v={{ size: 'm', properties: ['margin-top'] }}>
              <p className={`${font('intb', 5)} no-margin`}>
                <Number color="yellow" number={childManifestsCount} />
                {childManifestsCount === 1 ? ' volume ' : ' volumes '}
                online
              </p>
            </Space>
          )}
        </SpacingComponent>
      </Space>
    </WorkHeaderContainer>
  );
};
export default WorkHeader;
