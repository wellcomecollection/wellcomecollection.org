import { useContext, useEffect, useState } from 'react';

import { ServerDataContext } from '@weco/common/server-data/Context';
import { classNames } from '@weco/common/utils/classnames';
import { Container } from '@weco/common/views/components/styled/Container';
import { Grid, GridCell } from '@weco/common/views/components/styled/Grid';
import LL from '@weco/common/views/components/styled/LL';
import Space from '@weco/common/views/components/styled/Space';
import {
  Work,
  WorkBasic,
} from '@weco/content/services/wellcome/catalogue/types';
import BetaMessage from '@weco/content/views/components/BetaMessage';
import Tabs from '@weco/content/views/components/Tabs';

import RelatedWorksCard from './RelatedWorks.Card';
import { fetchRelatedWorks } from './RelatedWorks.helpers';
import { FullWidthRow } from './RelatedWorks.styles';

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
  const [hasThumbnails, setHasThumbnails] = useState(false);

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
        if (data)
          setHasThumbnails(
            Object.values(data).some(tab =>
              tab.results.some(result => result.thumbnail?.url)
            )
          );

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

  return relatedWorksTabs && selectedTab ? (
    <>
      <Container>
        <Space $v={{ size: 'l', properties: ['padding-top'] }}>
          <h2>More works</h2>
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
              gtmData: { category: value.category },
            }))}
          />
        )}
      </Container>

      {Object.entries(relatedWorksTabs).map(([key, value], tabIndex) => (
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
                  <RelatedWorksCard
                    work={result}
                    gtmData={{
                      cardIndex: i + 1,
                      category: value.category,
                      categoryName: value.label,
                      categoryPosition: tabIndex + 1,
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
        </FullWidthRow>
      ))}

      {hasThumbnails && (
        // Because we use `object-fit` on the image, border-radius won't work consistently, so we have to add an svg filter
        // This is adapted from https://stackoverflow.com/questions/49567069/image-rounded-corners-issue-with-object-fit-contain/76106794#76106794
        <svg
          style={{ position: 'absolute', visibility: 'hidden' }}
          width="0"
          height="0"
        >
          <defs>
            <filter id="border-radius-mask">
              <feGaussianBlur
                in="SourceGraphic"
                stdDeviation="2"
                result="blur"
              />
              <feColorMatrix
                in="blur"
                mode="matrix"
                values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 100 -50"
                result="mask"
              />
              <feComposite in="SourceGraphic" in2="mask" operator="atop" />
            </filter>
          </defs>
        </svg>
      )}
    </>
  ) : null;
};

export default RelatedWorks;
