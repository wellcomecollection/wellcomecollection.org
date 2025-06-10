import { useContext, useEffect, useState } from 'react';

import { ServerDataContext } from '@weco/common/server-data/Context';
import { classNames } from '@weco/common/utils/classnames';
import { Container } from '@weco/common/views/components/styled/Container';
import { Grid, GridCell } from '@weco/common/views/components/styled/Grid';
import LL from '@weco/common/views/components/styled/LL';
import Space from '@weco/common/views/components/styled/Space';
import Tabs from '@weco/content/components/Tabs';
import {
  Work,
  WorkBasic,
} from '@weco/content/services/wellcome/catalogue/types';

import RelatedWorksCard from './RelatedWorks.Card';
import { fetchRelatedWorks } from './RelatedWorks.helpers';
import { FullWidthRow } from './RelatedWorks.styles';

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
    <>
      <Container>
        <Space $v={{ size: 'l', properties: ['padding-top'] }}>
          <h2>Related Works</h2>
        </Space>

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
      </Container>

      {Object.entries(relatedWorksTabs).map(([key, value]) => (
        <FullWidthRow
          key={key}
          className={classNames({
            'is-hidden': selectedTab !== key,
          })}
        >
          <Container>
            <Grid>
              {value.results.map((result, i) => (
                <GridCell
                  key={result.id}
                  $sizeMap={{ s: [12], m: [12], l: [6], xl: [4] }}
                >
                  <RelatedWorksCard resultIndex={i} work={result} />
                </GridCell>
              ))}
            </Grid>
          </Container>
        </FullWidthRow>
      ))}
    </>
  ) : null;
};

export default RelatedWorks;
