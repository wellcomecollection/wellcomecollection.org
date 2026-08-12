import NextLink from 'next/link';
import { ReactNode } from 'react';
import styled from 'styled-components';

import { archive } from '@weco/common/icons';
import { typography } from '@weco/common/utils/classnames';
import Divider from '@weco/common/views/components/Divider';
import Icon from '@weco/common/views/components/Icon';
import LabelsList from '@weco/common/views/components/LabelsList';
import { Container } from '@weco/common/views/components/styled/Container';
import Space from '@weco/common/views/components/styled/Space';
import { themeValues } from '@weco/common/views/themes/config';
import { Work as WorkType } from '@weco/content/services/wellcome/catalogue/types';
import {
  conceptOrSearchLink,
  getCardLabels,
  getProductionDates,
  getSubjectTags,
} from '@weco/content/utils/works';
import WorkTitle from '@weco/content/views/components/WorkTitle';

import WorkDetailsTags from './WorkDetails/WorkDetails.Tags';

const WorkTitleWrapper = styled.h1.attrs({
  className: typography('heading', 'xl', 'strong', 'sans'),
})`
  margin: 0;
`;

const RootHeader = styled(Space).attrs({
  $v: { size: 'md', properties: ['padding-top', 'padding-bottom'] },
})`
  background-color: ${props => props.theme.color('warmNeutral.300')};
`;

const ArchiveIconWrapper = styled.span.attrs({
  className: typography('body', 'md', 'regular'),
})`
  margin-right: ${props => props.theme.spacingUnits['050']};
  color: ${props => props.theme.color('neutral.600')};

  .icon {
    transform: translateY(0.1em);
  }
`;

const HeaderInfoContainer = styled(Space).attrs({
  as: 'dl',
  $v: { size: 'sm', properties: ['margin-top'] },
})`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacingUnits['100']};

  ${props =>
    props.theme.media('md')(`
    flex-direction: row;
    gap: ${props.theme.spacingUnits['600']};
  `)}
`;

const InfoLabel = styled.dt.attrs({
  className: typography('body', 'md', 'regular'),
})`
  color: ${props => props.theme.color('neutral.600')};
  display: block;
  line-height: 1;
  margin-bottom: ${props => props.theme.spacingUnits['100']};
`;

const InfoValue = styled.dd.attrs({
  className: typography('body', 'md', 'regular'),
})`
  margin: 0;
`;

const HeaderInfo = ({
  label,
  value,
}: {
  label: string;
  value: ReactNode | string[];
}) => {
  return (
    <div>
      <InfoLabel>{label}:</InfoLabel>
      <InfoValue>{Array.isArray(value) ? value.join(', ') : value}</InfoValue>
    </div>
  );
};

const CollectionRootLayout = ({ work }: { work: WorkType }) => {
  const languageId = getLanguageId(work);

  const primaryContributor = work.contributors.find(
    contributor => contributor.primary
  )?.agent;

  const shortDescription = 'Temp short description';

  const subjectTags = getSubjectTags(work);

  const productionDates = getProductionDates(work);

  const accessCondition = 'Temp access info';

  return (
    <RootHeader>
      <Container>
        <Space $v={{ size: 'sm', properties: ['margin-bottom'] }}>
          <LabelsList labels={getCardLabels(work)} defaultLabelColor="white" />
        </Space>

        <WorkTitleWrapper aria-live="polite" id="work-info" lang={languageId}>
          <WorkTitle title={work.title} />
        </WorkTitleWrapper>

        <ArchiveIconWrapper>
          <Icon icon={archive} matchText />
        </ArchiveIconWrapper>
        <span
          className={typography('body', 'md', 'regular')}
          style={{ color: themeValues.color('neutral.600') }}
        >
          Archive Collection
        </span>

        {shortDescription && (
          <Space $v={{ size: 'sm', properties: ['margin-bottom'] }}>
            <span>{shortDescription}</span>
          </Space>
        )}

        {subjectTags.length > 0 && (
          <Space $v={{ size: 'md', properties: ['margin-bottom'] }}>
            <dl style={{ margin: 0 }}>
              <HeaderInfo
                label="Subjects"
                value={
                  <WorkDetailsTags
                    buttonColors={
                      themeValues.buttonColors.charcoalWhiteCharcoal
                    }
                    tags={subjectTags}
                  />
                }
              />
            </dl>
          </Space>
        )}

        {(primaryContributor ||
          productionDates.length > 0 ||
          work.referenceNumber ||
          accessCondition) && (
          <>
            <Divider lineColor="neutral.600" />

            <HeaderInfoContainer>
              {primaryContributor && (
                <HeaderInfo
                  label="Contributor"
                  value={
                    <NextLink
                      className={typography('body', 'md', 'regular')}
                      {...conceptOrSearchLink({
                        id: primaryContributor.id,
                        filterKey: 'contributors.agent.label',
                        filterValue: primaryContributor.label,
                      })}
                    >
                      {primaryContributor.label}
                    </NextLink>
                  }
                />
              )}

              {productionDates.length > 0 && (
                <HeaderInfo
                  label="Publication/Creation"
                  value={productionDates}
                />
              )}

              {work.referenceNumber && (
                <HeaderInfo label="Reference" value={work.referenceNumber} />
              )}

              {accessCondition && (
                <HeaderInfo label="Access" value={accessCondition} />
              )}
            </HeaderInfoContainer>
          </>
        )}
      </Container>
    </RootHeader>
  );
};

export default CollectionRootLayout;
