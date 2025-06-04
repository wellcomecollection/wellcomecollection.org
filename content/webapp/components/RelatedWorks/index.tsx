import { useContext, useEffect, useState } from 'react';

import { ServerDataContext } from '@weco/common/server-data/Context';
import { classNames } from '@weco/common/utils/classnames';
import { Container } from '@weco/common/views/components/styled/Container';
import Space from '@weco/common/views/components/styled/Space';
import Tabs from '@weco/content/components/Tabs';
import WorksSearchResult from '@weco/content/components/WorksSearchResult';
import {
  Work,
  WorkBasic,
} from '@weco/content/services/wellcome/catalogue/types';

import { fetchRelated, getRelatedTabConfig } from './RelatedWorks.helpers';

const RelatedWorks = ({ work }: { work: Work }) => {
  const { toggles } = useContext(ServerDataContext);

  const [relatedWorks, setRelatedWorks] = useState<{
    [key: string]: WorkBasic[] | undefined;
  }>({});
  const [relatedTabConfig, setRelatedTabConfig] = useState<{
    [key: string]: {
      text: string;
      params: { [key: string]: string | string[] };
      related?: WorkBasic[];
      setRelated: (results: WorkBasic[]) => void;
    };
  }>({});

  // Set selected tab to first available tab
  const tabKeys = Object.keys(relatedTabConfig);
  const [selectedWorksTab, setSelectedWorksTab] = useState(tabKeys[0] || '');

  useEffect(() => {
    // Reset selected tab, related works and tab config when work changes
    setSelectedWorksTab('');
    setRelatedWorks({});

    (async () => {
      const config = await getRelatedTabConfig({
        work,
        relatedWorks,
        setRelatedWorks,
      });

      setRelatedTabConfig(config);
    })();
  }, [work.id]);

  useEffect(() => {
    setSelectedWorksTab(tabKeys[0] || '');
  }, [relatedTabConfig]);

  useEffect(() => {
    if (
      relatedTabConfig[selectedWorksTab] &&
      !relatedWorks?.[selectedWorksTab]
    ) {
      fetchRelated({
        work,
        toggles,
        params: relatedTabConfig[selectedWorksTab].params,
        setRelated: relatedTabConfig[selectedWorksTab].setRelated,
      });
    }
  }, [selectedWorksTab]);

  return tabKeys.length === 0 ? null : (
    <Container>
      <Space $v={{ size: 'l', properties: ['padding-top'] }}>
        <h2>Related Works</h2>

        <Tabs
          tabBehaviour="switch"
          label="Related works control"
          selectedTab={selectedWorksTab}
          items={Object.entries(relatedTabConfig).map(([id, config]) => ({
            id,
            url: `#${id}`,
            text: config.text,
          }))}
          setSelectedTab={setSelectedWorksTab}
        />

        {Object.keys(relatedTabConfig).map(tabKey => (
          <div
            key={tabKey}
            className={classNames({
              'is-hidden': selectedWorksTab !== tabKey,
            })}
          >
            {relatedWorks[tabKey]?.map((result, i) => (
              <WorksSearchResult
                work={result}
                resultPosition={i}
                key={result.id}
              />
            ))}
          </div>
        ))}
      </Space>
    </Container>
  );
};

export default RelatedWorks;
