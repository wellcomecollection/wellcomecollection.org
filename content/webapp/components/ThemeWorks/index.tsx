import { FunctionComponent, useState } from 'react';
import styled from 'styled-components';

import { WorksLinkSource } from '@weco/common/data/segment-values';
import { font } from '@weco/common/utils/classnames';
import {
  capitalize,
  formatNumber,
  pluralize,
} from '@weco/common/utils/grammar';
import { Container } from '@weco/common/views/components/styled/Container';
import Space from '@weco/common/views/components/styled/Space';
import { WobblyEdge } from '@weco/common/views/components/WobblyEdge';
import theme from '@weco/common/views/themes/default';
import MoreLink from '@weco/content/components/MoreLink';
import { toLink as toWorksLink } from '@weco/content/components/SearchPagesLink/Works';
import Tabs from '@weco/content/components/Tabs';
import WorksSearchResults from '@weco/content/components/WorksSearchResults';
import {
  SectionData,
  ThemePageSectionsData,
} from '@weco/content/pages/concepts/[conceptId]';
import {
  Concept,
  ConceptType,
} from '@weco/content/services/wellcome/catalogue/types';
import { allRecordsLinkParams } from '@weco/content/utils/concepts';

export type ThemeTabType = 'by' | 'in' | 'about';
export const themeTabOrder: ThemeTabType[] = ['by', 'in', 'about'] as const;

export const getThemeTabLabel = (
  type: ThemeTabType,
  conceptType: ConceptType
) => {
  if (type === 'about' && conceptType === 'Person') return 'featuring';
  if (type === 'in') return 'using';
  return type;
};

export const getThemeTypeLabel = (conceptType: ConceptType) => {
  if (conceptType === 'Genre') return 'type/technique';
  if (conceptType === 'Concept') return 'topic';
  return conceptType;
};

const WorksCount = styled(Space).attrs({
  as: 'p',
  className: font('intr', 6),
  $v: { size: 's', properties: ['padding-top'] },
})`
  color: ${props => props.theme.color('neutral.600')};
  border-top: 1px solid ${props => props.theme.color('warmNeutral.300')};
`;

const getAllWorksLink = (tab: ThemeTabType, concept: Concept) => {
  const linkSource = `concept/works_${tab}` as WorksLinkSource;
  const sectionName = `works${capitalize(tab)}`;
  return toWorksLink(allRecordsLinkParams(sectionName, concept), linkSource);
};

type Props = {
  concept: Concept;
  sectionsData: ThemePageSectionsData;
};

const ThemeWorks: FunctionComponent<Props> = ({ concept, sectionsData }) => {
  const tabs = themeTabOrder
    .filter(
      tabType =>
        sectionsData[tabType].works &&
        sectionsData[tabType].works.pageResults.length > 0
    )
    .map(tabType => {
      const tabLabel = getThemeTabLabel(tabType, concept.type);
      const conceptTypeLabel = getThemeTypeLabel(concept.type);

      return {
        id: tabType,
        text: capitalize(`${tabLabel} this ${conceptTypeLabel}`),
      };
    });

  const [selectedTab, setSelectedTab] = useState<ThemeTabType | null>(
    tabs.length > 0 ? tabs[0].id : null
  );

  if (!selectedTab) {
    return null;
  }

  const activePanel: SectionData = sectionsData[selectedTab];
  if (!activePanel.works || !activePanel.totalResults.works) return null;

  const labelBasedCount = activePanel.totalResults.works;
  const formattedLabelBasedCount = formatNumber(labelBasedCount, {
    isCompact: true,
  });

  return (
    <>
      <WobblyEdge backgroundColor="white" />
      <Space $v={{ size: 'xl', properties: ['margin-top'] }}>
        <Container>
          <h2 className={font('intsb', 2)}>Works</h2>
          {tabs.length > 1 && (
            <Tabs
              label="Works tabs"
              tabBehaviour="switch"
              selectedTab={selectedTab}
              items={tabs}
              setSelectedTab={tab => setSelectedTab(tab as ThemeTabType)}
              trackWithSegment
              hideBorder
            />
          )}
        </Container>
        <Space
          $v={{ size: 'xl', properties: ['margin-bottom'] }}
          as="section"
          data-testid="works-section"
        >
          <Container>
            <div role="tabpanel">
              <WorksCount>
                {pluralize(activePanel.works.totalResults, 'work')}
              </WorksCount>
              <Space $v={{ size: 'l', properties: ['margin-top'] }}>
                <WorksSearchResults works={activePanel.works.pageResults} />
              </Space>
              {labelBasedCount > activePanel.works.pageResults.length && (
                <Space $v={{ size: 'l', properties: ['padding-top'] }}>
                  <MoreLink
                    name={`All works (${formattedLabelBasedCount})`}
                    url={getAllWorksLink(selectedTab, concept)}
                    colors={theme.buttonColors.greenGreenWhite}
                  />
                </Space>
              )}
            </div>
          </Container>
        </Space>
      </Space>
    </>
  );
};

export default ThemeWorks;
