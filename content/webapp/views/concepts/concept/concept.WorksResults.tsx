import { FunctionComponent, useState } from 'react';
import styled from 'styled-components';

import { WorksLinkSource } from '@weco/common/data/segment-values';
import { font } from '@weco/common/utils/classnames';
import {
  capitalize,
  formatNumber,
  pluralize,
} from '@weco/common/utils/grammar';
import Space from '@weco/common/views/components/styled/Space';
import { WobblyEdge } from '@weco/common/views/components/WobblyEdge';
import theme from '@weco/common/views/themes/default';
import MoreLink from '@weco/content/components/MoreLink';
import { toLink as toWorksLink } from '@weco/content/components/SearchPagesLink/Works';
import Tabs from '@weco/content/components/Tabs';
import WorksSearchResults from '@weco/content/components/WorksSearchResults';
import { Concept } from '@weco/content/services/wellcome/catalogue/types';
import {
  allRecordsLinkParams,
  conceptTypeDisplayName,
} from '@weco/content/utils/concepts';
import {
  getThemeTabLabel,
  SectionData,
  ThemePageSectionsData,
  themeTabOrder,
  ThemeTabType,
} from '@weco/content/views/concepts/concept/concept.helpers';

const WorksCount = styled(Space).attrs({
  as: 'p',
  className: font('intr', 6),
  $v: { size: 's', properties: ['padding-top'] },
})`
  color: ${props => props.theme.color('neutral.600')};
  border-top: 1px solid ${props => props.theme.color('warmNeutral.300')};
`;

const WobblyEdgeWrapper = styled.div`
  z-index: 0;
  position: relative;
  margin-left: calc((100vw - 100%) * -1);
  ${props => props.theme.pageGridOffset('margin-right')};
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

const WorksResults: FunctionComponent<Props> = ({ concept, sectionsData }) => {
  const tabs = themeTabOrder
    .filter(
      tabType =>
        sectionsData[tabType].works &&
        sectionsData[tabType].works.pageResults.length > 0
    )
    .map(tabType => {
      const tabLabel = getThemeTabLabel(tabType, concept.type);
      const conceptTypeLabel = conceptTypeDisplayName(concept).toLowerCase();

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
  if (!activePanel.works || activePanel.totalResults.works === undefined)
    return null;

  const labelBasedCount = activePanel.totalResults.works;
  const formattedLabelBasedCount = formatNumber(labelBasedCount, {
    isCompact: true,
  });

  return (
    <>
      <WobblyEdgeWrapper>
        <WobblyEdge backgroundColor="white" />
      </WobblyEdgeWrapper>
      <Space $v={{ size: 'xl', properties: ['margin-top'] }}>
        <h2 id="works" className={font('intsb', 2)}>
          Works
        </h2>
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
        <Space
          $v={{ size: 'xl', properties: ['margin-bottom'] }}
          as="section"
          data-testid="works-section"
        >
          <div role="tabpanel">
            <WorksCount>
              {pluralize(activePanel.works.totalResults, 'work')}
            </WorksCount>
            <Space $v={{ size: 'l', properties: ['margin-top'] }}>
              <WorksSearchResults works={activePanel.works!.pageResults} />
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
        </Space>
      </Space>
    </>
  );
};

export default WorksResults;
