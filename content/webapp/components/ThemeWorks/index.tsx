import { FunctionComponent, useState } from 'react';

import Space from '@weco/common/views/components/styled/Space';
import { Container } from '@weco/common/views/components/styled/Container';
import {
  SectionData,
  ThemePageSectionsData,
} from '../../pages/concepts/[conceptId]';
import { font } from '@weco/common/utils/classnames';
import Tabs from '../Tabs';
import WorksSearchResults from '../WorksSearchResults';
import MoreLink from '../MoreLink';
import theme from '@weco/common/views/themes/default';
import { Concept } from '../../services/wellcome/catalogue/types';
import { toLink as toWorksLink } from '../SearchPagesLink/Works';
import { allRecordsLinkParams } from '../../utils/concepts';
import { WorksLinkSource } from '@weco/common/data/segment-values';
import { capitalize, formatNumber } from '@weco/common/utils/grammar';
import { WobblyEdge } from '@weco/common/views/components/WobblyEdge';

export type ThemeTabType = 'by' | 'in' | 'about';
export const themeTabOrder: ThemeTabType[] = ['by', 'in', 'about'] as const;

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
    .filter(tabType => sectionsData[tabType].works?.totalResults)
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
  const formattedTotalCount = formatNumber(activePanel.works!.totalResults, {
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
          as="section"
          $v={{
            size: 'xl',
            properties: ['margin-top'],
          }}
          data-testid="works-section"
        >
          <Container>
            <div role="tabpanel">
              <WorksSearchResults works={activePanel.works!.pageResults} />
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
