import styled from 'styled-components';

import { archive } from '@weco/common/icons';
import { typography } from '@weco/common/utils/classnames';
import Icon from '@weco/common/views/components/Icon';
import LabelsList from '@weco/common/views/components/LabelsList';
import { Container } from '@weco/common/views/components/styled/Container';
import Space from '@weco/common/views/components/styled/Space';
import { themeValues } from '@weco/common/views/themes/config';
import { Work as WorkType } from '@weco/content/services/wellcome/catalogue/types';
import { getCardLabels, getProductionDates } from '@weco/content/utils/works';
import { toConceptLink } from '@weco/content/views/components/ConceptLink';
import { toSearchWorksLink } from '@weco/content/views/components/SearchPagesLink/Works';
import WorkTitle from '@weco/content/views/components/WorkTitle';

import WorkDetailsSection from './WorkDetails/WorkDetails.Section';
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

const HeaderInfo = ({
  label,
  value,
}: {
  label: string;
  value: string | string[];
}) => {
  return (
    <div className={typography('body', 'md', 'regular')}>
      <span
        style={{ color: themeValues.color('neutral.600'), display: 'block' }}
      >
        {label}:
      </span>
      <span>{Array.isArray(value) ? value.join(', ') : value}</span>
    </div>
  );
};

const CollectionRootLayout = ({ work }: { work: WorkType }) => {
  // We only send a lang if it's unambiguous -- better to send
  // no language than the wrong one.
  const languageId =
    work.languages && work.languages.length === 1
      ? work.languages[0].id
      : undefined;

  const primaryContributorLabel = work.contributors.find(
    contributor => contributor.primary
  )?.agent.label;

  return (
    <RootHeader>
      <Container>
        <LabelsList labels={getCardLabels(work)} defaultLabelColor="white" />
        <WorkTitleWrapper aria-live="polite" id="work-info" lang={languageId}>
          <WorkTitle title={work.title} />
        </WorkTitleWrapper>

        <ArchiveIconWrapper>
          <Icon icon={archive} matchText />
        </ArchiveIconWrapper>
        <span className={typography('body', 'md', 'regular')}>
          Archive Collection
        </span>

        <Space $v={{ size: 'sm', properties: ['margin-bottom'] }}>
          <span>Short description</span>
        </Space>

        {work.subjects.length > 0 && (
          <WorkDetailsSection headingText="Subjects">
            <WorkDetailsTags
              buttonColors={themeValues.buttonColors.charcoalWhiteCharcoal}
              tags={work.subjects.map(s => {
                /*
                  If this is an identified subject, link to the concepts prototype
                  page instead.
                */
                return s.id
                  ? {
                      textParts: [s.concepts[0].label].concat(
                        s.concepts.slice(1).map(c => c.label)
                      ),
                      linkAttributes: toConceptLink({ conceptId: s.id }),
                    }
                  : {
                      textParts: s.concepts.map(c => c.label),
                      linkAttributes: toSearchWorksLink({
                        'subjects.label': [s.label],
                      }),
                    };
              })}
            />
          </WorkDetailsSection>
        )}

        <div style={{ display: 'flex', gap: themeValues.spacingUnits['600'] }}>
          {primaryContributorLabel && (
            <HeaderInfo label="Contributor" value={primaryContributorLabel} />
          )}

          <HeaderInfo
            label="Publication/Creator"
            value={getProductionDates(work)}
          />

          {work.referenceNumber && (
            <HeaderInfo label="Reference" value={work.referenceNumber} />
          )}

          <HeaderInfo label="Access" value="Static copy" />
        </div>
      </Container>
    </RootHeader>
  );
};

export default CollectionRootLayout;
