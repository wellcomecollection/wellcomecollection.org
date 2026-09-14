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
  getLanguageId,
  getProductionDates,
  getSubjectTags,
} from '@weco/content/utils/works';
import WorkTitle from '@weco/content/views/components/WorkTitle';
import WorkDetailsTags from '@weco/content/views/pages/works/work/WorkDetails/WorkDetails.Tags';

const Hero = styled(Space).attrs({
  $v: { size: 'md', properties: ['padding-top', 'padding-bottom'] },
})`
  background-color: ${props => props.theme.color('warmNeutral.300')};
`;

const WorkTitleWrapper = styled.h1.attrs({
  className: typography('heading', 'xl', 'strong', 'sans'),
})`
  margin: 0;
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

const ArchiveCollectionLabel = styled.span.attrs({
  className: typography('body', 'md', 'regular'),
})`
  color: ${props => props.theme.color('neutral.600')};
`;

const SubjectsList = styled.dl`
  margin: 0;
`;

const HeroInfoContainer = styled(Space).attrs({
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

const HeroInfo = ({ label, value }: { label: string; value: ReactNode }) => {
  return (
    <div>
      <InfoLabel>{label}:</InfoLabel>
      <InfoValue>{Array.isArray(value) ? value.join(', ') : value}</InfoValue>
    </div>
  );
};

const ArchiveCollectionHero = ({ work }: { work: WorkType }) => {
  const languageId = getLanguageId(work);

  const primaryContributor = work.contributors.find(
    contributor => contributor.primary
  )?.agent;

  const subjectTags = getSubjectTags(work);

  const productionDates = getProductionDates(work);

  return (
    <Hero>
      <Container>
        <Space $v={{ size: 'sm', properties: ['margin-bottom'] }}>
          <LabelsList
            labels={getCardLabels(work)}
            defaultLabelColor="white"
            outlineLightLabels={false}
          />
        </Space>

        <Space $v={{ size: 'sm', properties: ['margin-bottom'] }}>
          <WorkTitleWrapper aria-live="polite" id="work-info" lang={languageId}>
            <WorkTitle title={work.title} />
          </WorkTitleWrapper>

          <ArchiveIconWrapper>
            <Icon icon={archive} matchText />
          </ArchiveIconWrapper>
          <ArchiveCollectionLabel>Archive Collection</ArchiveCollectionLabel>
        </Space>

        {subjectTags.length > 0 && (
          <Space $v={{ size: 'md', properties: ['margin-bottom'] }}>
            <SubjectsList>
              <HeroInfo
                label="Subjects"
                value={
                  <WorkDetailsTags
                    buttonColors={themeValues.buttonColors.slateWhiteBlack}
                    tags={subjectTags}
                  />
                }
              />
            </SubjectsList>
          </Space>
        )}

        {(primaryContributor ||
          productionDates.length > 0 ||
          work.referenceNumber) && (
          <>
            <Divider lineColor="neutral.600" />

            <HeroInfoContainer>
              {primaryContributor && (
                <HeroInfo
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
                <HeroInfo
                  label="Publication/Creation"
                  value={productionDates}
                />
              )}

              {work.referenceNumber && (
                <HeroInfo label="Reference" value={work.referenceNumber} />
              )}
            </HeroInfoContainer>
          </>
        )}
      </Container>
    </Hero>
  );
};

export default ArchiveCollectionHero;
