import { FunctionComponent, useState } from 'react';
import styled, { useTheme } from 'styled-components';

import { useAppContext } from '@weco/common/contexts/AppContext';
import { typography } from '@weco/common/utils/classnames';
import { capitalize, pluralize } from '@weco/common/utils/grammar';
import DecorativeEdge from '@weco/common/views/components/DecorativeEdge';
import Space from '@weco/common/views/components/styled/Space';
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
  className: typography('body', 'sm', 'regular'),
  $v: { size: 'xs', properties: ['padding-top'] },
})`
  color: ${props => props.theme.color('neutral.600')};
  border-top: 1px solid ${props => props.theme.color('warmNeutral.300')};
`;

const DecorativeEdgeWrapper = styled.div`
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
  const theme = useTheme();
  const { isEnhanced } = useAppContext();
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

  return (
    <>
      <DecorativeEdgeWrapper>
        <DecorativeEdge variant="wobbly" backgroundColor="white" />
      </DecorativeEdgeWrapper>
      <Space $v={{ size: 'xl', properties: ['margin-top'] }} as="section">
        <Space $v={{ size: 'sm', properties: ['margin-bottom'] }}>
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
            hideBorder
          />
        )}
        <Space
          $v={{ size: 'xl', properties: ['margin-bottom'] }}
          as="section"
          data-testid="works-section"
        >
          {tabs.map(tab => {
            const panel: SectionData = sectionsData[tab.id];
            const works = panel.works!;
            const labelBasedCount =
              panel.totalResults.works ?? works.pageResults.length;

            return (
              <div
                key={tab.id}
                {...(tabs.length > 1 && {
                  role: 'tabpanel',
                  id: `tabpanel-${tab.id}`,
                  'aria-labelledby': `tab-${tab.id}`,
                })}
                hidden={isEnhanced && selectedTab !== tab.id}
              >
                <WorksCount>{pluralize(works.totalResults, 'work')}</WorksCount>
                <Space $v={{ size: 'md', properties: ['margin-top'] }}>
                  <WorksSearchResults works={works.pageResults} />
                </Space>

                {labelBasedCount > works.pageResults.length && (
                  <Space $v={{ size: 'md', properties: ['padding-top'] }}>
                    <MoreLink
                      ariaLabel={`View all works for ${concept.displayLabel}`}
                      name="View all"
                      url={getAllWorksLink(tab.id, concept)}
                      colors={theme.buttonColors.greenGreenWhite}
                    />
                  </Space>
                )}
              </div>
            );
          })}
        </Space>
      </Space>
    </>
  );
};

export default WorksResults;
