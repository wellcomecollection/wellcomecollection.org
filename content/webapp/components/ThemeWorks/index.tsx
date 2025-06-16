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
import { Concept } from '@weco/content/services/wellcome/catalogue/types';
import { allRecordsLinkParams } from '@weco/content/utils/concepts';

export type ThemeTabType = 'by' | 'in' | 'about';
export const themeTabOrder: ThemeTabType[] = ['by', 'in', 'about'] as const;

const WorksCount = styled(Space).attrs({
  as: 'p',
  className: font('intr', 6),
  $v: { size: 's', properties: ['padding-top'] },
})`
  color: ${props => props.theme.color('neutral.600')};
  border-top: 1px solid ${props => props.theme.color('warmNeutral.300')};
`;

const getLinkSource = (type: ThemeTabType) => {
  return `concept/works_${type}` as WorksLinkSource;
};

const getAllWorksLink = (tabType: ThemeTabType, concept: Concept) => {
  const linkSource = getLinkSource(tabType);
  const sectionName = `works${capitalize(tabType)}`;
  return toWorksLink(allRecordsLinkParams(sectionName, concept), linkSource);
};

type Props = {
  concept: Concept;
  sectionsData: ThemePageSectionsData;
};

const ThemeWorks: FunctionComponent<Props> = ({ concept, sectionsData }) => {
  const tabs = themeTabOrder
    .filter(tabType => sectionsData[tabType].totalResults.works)
    .map(tabType => {
      return {
        id: tabType,
        text: sectionsData[tabType].label,
      };
    });

  const [selectedTab, setSelectedTab] = useState<ThemeTabType | null>(
    tabs.length > 0 ? tabs[0].id : null
  );

  if (selectedTab == null) {
    return null;
  }

  const activePanel: SectionData = sectionsData[selectedTab];
  const totalWorksCount = activePanel.totalResults.works!;
  const formattedTotalCount = formatNumber(totalWorksCount, {
    isCompact: true,
  });

  return (
    <>
      <WobblyEdge backgroundColor="white" />
      <Space $v={{ size: 'xl', properties: ['margin-top', 'margin-bottom'] }}>
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
        <Space as="section" data-testid="works-section">
          <Container>
            <div role="tabpanel">
              <WorksCount>{pluralize(totalWorksCount, 'work')}</WorksCount>
              <Space $v={{ size: 'l', properties: ['margin-top'] }}>
                <WorksSearchResults works={activePanel.works!.pageResults} />
              </Space>
              <Space $v={{ size: 'l', properties: ['padding-top'] }}>
                <MoreLink
                  name={`All works (${formattedTotalCount})`}
                  url={getAllWorksLink(selectedTab, concept)}
                  colors={theme.buttonColors.greenWhiteGreen}
                />
              </Space>
            </div>
          </Container>
        </Space>
      </Space>
    </>
  );
};

export default ThemeWorks;
