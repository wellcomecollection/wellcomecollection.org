import { useContext, useEffect, useState } from 'react';

import { ServerDataContext } from '@weco/common/server-data/Context';
import { classNames } from '@weco/common/utils/classnames';
import { Container } from '@weco/common/views/components/styled/Container';
import LL from '@weco/common/views/components/styled/LL';
import Space from '@weco/common/views/components/styled/Space';
import Tabs from '@weco/content/components/Tabs';
import WorksSearchResult from '@weco/content/components/WorksSearchResult';
import {
  Work,
  WorkBasic,
} from '@weco/content/services/wellcome/catalogue/types';

import { fetchRelatedWorks } from './RelatedWorks.helpers';

const RelatedWorks = ({ work }: { work: Work }) => {
  const { toggles } = useContext(ServerDataContext);
  const [isLoading, setIsLoading] = useState(true);
  const [relatedWorksTabs, setRelatedWorksTabs] = useState<{
    [key: string]: { label: string; results: WorkBasic[] };
  }>();
  const [selectedTab, setSelectedTab] = useState<string | undefined>();

  useEffect(() => {
    setIsLoading(true);
    setRelatedWorksTabs(undefined);
    setSelectedTab(undefined);

    const fetchData = async () => {
      await fetchRelatedWorks({
        work,
        toggles,
        setIsLoading,
      }).then(data => {
        setRelatedWorksTabs(data);

        setIsLoading(false);
      });
    };

    fetchData();
  }, [work]);

  useEffect(() => {
    if (relatedWorksTabs && !selectedTab) {
      const firstTabKey = Object.keys(relatedWorksTabs)[0];
      if (firstTabKey) setSelectedTab(firstTabKey);
    }
  }, [relatedWorksTabs]);

  if (isLoading)
    return (
      <div style={{ position: 'relative', minHeight: '200px' }}>
        <LL />
      </div>
    );

  return relatedWorksTabs && selectedTab ? (
    <Container>
      <Space $v={{ size: 'l', properties: ['padding-top'] }}>
        <h2>Related works</h2>

        {Object.keys(relatedWorksTabs).length > 1 && (
          <Tabs
            tabBehaviour="switch"
            label="Related works control"
            selectedTab={selectedTab}
            setSelectedTab={setSelectedTab}
            items={Object.entries(relatedWorksTabs).map(([key, value]) => ({
              id: key,
              url: `#${key}`,
              text: value.label,
            }))}
          />
        )}

        {Object.entries(relatedWorksTabs).map(([key, value]) => (
          <div
            key={key}
            className={classNames({
              'is-hidden': selectedTab !== key,
            })}
          >
            {value.results.map((result, i) => (
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
  ) : null;
};

export default RelatedWorks;
