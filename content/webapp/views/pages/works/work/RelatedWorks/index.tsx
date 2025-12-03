import { useContext, useEffect, useState } from 'react';
import styled from 'styled-components';

import { ServerDataContext } from '@weco/common/server-data/Context';
import { classNames, font } from '@weco/common/utils/classnames';
import { Container } from '@weco/common/views/components/styled/Container';
import { Grid, GridCell } from '@weco/common/views/components/styled/Grid';
import LL from '@weco/common/views/components/styled/LL';
import Space from '@weco/common/views/components/styled/Space';
import {
  Work,
  WorkBasic,
} from '@weco/content/services/wellcome/catalogue/types';
import BetaMessage from '@weco/content/views/components/BetaMessage';
import RelatedWorksCard from '@weco/content/views/components/RelatedWorksCard';
import SelectableTags from '@weco/content/views/components/SelectableTags';

import { fetchRelatedWorks } from './RelatedWorks.helpers';

const SectionWrapper = styled(Space).attrs({
  $v: { size: 'l', properties: ['padding-top', 'padding-bottom'] },
})`
  background-color: ${props => props.theme.color('warmNeutral.300')};
`;

type SubjectsAtLeastOneSubject = [
  Work['subjects'][number],
  ...Work['subjects'],
];

export type RelatedWork = {
  [key: string]: { label: string; category: string; results: WorkBasic[] };
};

export function hasAtLeastOneSubject(
  subjects: Work['subjects']
): subjects is SubjectsAtLeastOneSubject {
  return Array.isArray(subjects) && subjects.length > 0;
}

export type WorkQueryProps = {
  workId: string;
  subjects: SubjectsAtLeastOneSubject;
  typesTechniques?: Work['genres'];
  date?: string;
};

const RelatedWorks = ({
  workId,
  subjects,
  typesTechniques,
  date,
}: WorkQueryProps) => {
  const { toggles } = useContext(ServerDataContext);
  const [isLoading, setIsLoading] = useState(true);
  const [relatedWorksTabs, setRelatedWorksTabs] = useState<RelatedWork>();
  const [selectedTab, setSelectedTab] = useState<string | undefined>();

  useEffect(() => {
    setIsLoading(true);
    setRelatedWorksTabs(undefined);
    setSelectedTab(undefined);

    const fetchData = async () => {
      await fetchRelatedWorks({
        workId,
        subjects,
        typesTechniques,
        date,
        toggles,
        setIsLoading,
      }).then(data => {
        setRelatedWorksTabs(data);

        setIsLoading(false);
      });
    };

    fetchData();
  }, [workId]);

  useEffect(() => {
    if (relatedWorksTabs && !selectedTab) {
      const firstTabKey = Object.keys(relatedWorksTabs)[0];
      if (firstTabKey) setSelectedTab(firstTabKey);
    }

    // Only do this if there are results to display
    if (
      !isLoading &&
      relatedWorksTabs &&
      Object.keys(relatedWorksTabs).length > 0
    ) {
      const dataLayerEvent = {
        event: 'related_works_displayed',
        relatedWorks: {
          tabs: Object.values(relatedWorksTabs).map(value => ({
            label: value.label,
            category: value.category,
            resultsCount: value.results.length,
          })),
        },
      };

      window.dataLayer?.push(dataLayerEvent);
    }
  }, [relatedWorksTabs]);

  if (isLoading)
    return (
      <div style={{ position: 'relative', minHeight: '200px' }}>
        <LL />
      </div>
    );

  if (!(relatedWorksTabs && selectedTab)) return null;

  return (
    <SectionWrapper>
      <Container>
        <h2 className={font('wb', 1)}>More works</h2>

        {Object.keys(relatedWorksTabs).length > 1 && (
          <SelectableTags
            tags={Object.entries(relatedWorksTabs).map(([key, value]) => ({
              id: key,
              label: value.label,
              controls: `#${key}`,
              gtmData: {
                trigger: 'selectable_tag_related_works_control',
                category: value.category,
                label: value.label,
              },
            }))}
            onChange={selectedId => setSelectedTab(selectedId[0])}
          />
        )}
      </Container>

      {Object.entries(relatedWorksTabs).map(([key, value], tabIndex) => (
        <Space
          key={key}
          $v={{ size: 'l', properties: ['padding-top', 'padding-bottom'] }}
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
                  <RelatedWorksCard
                    variant="default"
                    work={result}
                    gtmData={{
                      category: value.category,
                      'category-label': value.label,
                      'category-position-in-list': `${tabIndex + 1}`,
                      'position-in-list': `${i + 1}`,
                    }}
                  />
                </GridCell>
              ))}
            </Grid>

            <Space $v={{ size: 'l', properties: ['margin-top'] }}>
              <BetaMessage
                message={
                  <>
                    This feature is new.{' '}
                    <a href="mailto:digital@wellcomecollection.org?subject=Related works">
                      Let us know
                    </a>{' '}
                    if something doesn’t look right.
                  </>
                }
              />
            </Space>
          </Container>
        </Space>
      ))}
    </SectionWrapper>
  );
};

export default RelatedWorks;
