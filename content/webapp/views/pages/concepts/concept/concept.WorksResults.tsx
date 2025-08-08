import { FunctionComponent, useState } from 'react';
import styled from 'styled-components';

import { font } from '@weco/common/utils/classnames';
import { capitalize, pluralize } from '@weco/common/utils/grammar';
import Space from '@weco/common/views/components/styled/Space';
import { WobblyEdge } from '@weco/common/views/components/WobblyEdge';
import theme from '@weco/common/views/themes/default';
import { useConceptPageContext } from '@weco/content/contexts/ConceptPageContext';
import { Concept } from '@weco/content/services/wellcome/catalogue/types';
import { allRecordsLinkParams } from '@weco/content/utils/concepts';
import MoreLink from '@weco/content/views/components/MoreLink';
import { toSearchWorksLink } from '@weco/content/views/components/SearchPagesLink/Works';
import Tabs from '@weco/content/views/components/Tabs';
import WorksSearchResults from '@weco/content/views/components/WorksSearchResults';
import {
  getSectionTypeLabel,
  SectionData,
  ThemePageSectionsData,
  themeTabOrder,
  ThemeTabType,
} from '@weco/content/views/pages/concepts/concept/concept.helpers';

import { FromCollectionsHeading } from './concept.styles';

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
  const sectionName = `works${capitalize(tab)}`;
  return toSearchWorksLink(allRecordsLinkParams(sectionName, concept));
};

type Props = {
  concept: Concept;
  sectionsData: ThemePageSectionsData;
};

const WorksResults: FunctionComponent<Props> = ({ concept, sectionsData }) => {
  const { config } = useConceptPageContext();
  const tabs = themeTabOrder
    .filter(
      tabType =>
        sectionsData[tabType].works &&
        sectionsData[tabType].works.pageResults.length > 0
    )
    .map(tabType => ({
      id: tabType,
      text: getSectionTypeLabel(tabType, config, 'works'),
    }));

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

  return (
    <>
      <WobblyEdgeWrapper>
        <WobblyEdge backgroundColor="white" />
      </WobblyEdgeWrapper>
      <Space
        $v={{ size: 'xl', properties: ['margin-top'] }}
        as="section"
        data-id="works"
      >
        <Space $v={{ size: 'm', properties: ['margin-bottom'] }}>
          <FromCollectionsHeading id="works" $color="black">
            Works from the collections
          </FromCollectionsHeading>
        </Space>
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
          <div
            role="tabpanel"
            id={`tabpanel-${selectedTab}`}
            aria-labelledby={`tab-${selectedTab}`}
          >
            <WorksCount>
              {pluralize(activePanel.works.totalResults, 'work')}
            </WorksCount>
            <Space $v={{ size: 'l', properties: ['margin-top'] }}>
              <WorksSearchResults works={activePanel.works!.pageResults} />
            </Space>
            {labelBasedCount > activePanel.works.pageResults.length && (
              <Space $v={{ size: 'l', properties: ['padding-top'] }}>
                <MoreLink
                  ariaLabel={`View all works for ${concept.label}`}
                  name="View all"
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
