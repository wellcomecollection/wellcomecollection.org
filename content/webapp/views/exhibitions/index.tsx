import { FunctionComponent } from 'react';

import {
  pageDescriptions,
  pastExhibitionsStrapline,
} from '@weco/common/data/microcopy';
import { PaginatedResults } from '@weco/common/services/prismic/types';
import { Period } from '@weco/common/types/periods';
import { headerBackgroundLs } from '@weco/common/utils/backgrounds';
import { isFuture } from '@weco/common/utils/dates';
import { getBreadcrumbItems } from '@weco/common/views/components/Breadcrumb';
import CardGrid from '@weco/common/views/components/CardGrid';
import { JsonLdObj } from '@weco/common/views/components/JsonLd';
import {
  ContaineredLayout,
  gridSize12,
} from '@weco/common/views/components/Layout';
import PageHeader from '@weco/common/views/components/PageHeader';
import Pagination from '@weco/common/views/components/Pagination';
import PrismicHtmlBlock from '@weco/common/views/components/PrismicHtmlBlock';
import SectionHeader from '@weco/common/views/components/SectionHeader';
import { Container } from '@weco/common/views/components/styled/Container';
import PaginationWrapper from '@weco/common/views/components/styled/PaginationWrapper';
import Space from '@weco/common/views/components/styled/Space';
import SpacingSection from '@weco/common/views/components/styled/SpacingSection';
import PageLayout from '@weco/common/views/layouts/PageLayout';
import { ExhibitionBasic } from '@weco/content/types/exhibitions';

export type Props = {
  exhibitions: PaginatedResults<ExhibitionBasic>;
  period?: Period;
  title: string;
  jsonLd: JsonLdObj[];
};

const ExhibitionsPage: FunctionComponent<Props> = props => {
  const { exhibitions, period, title, jsonLd } = props;
  const firstExhibition = exhibitions[0];

  const partitionedExhibitionItems = exhibitions.results.reduce(
    (acc, result) => {
      if (result.end && isFuture(result.end)) {
        acc.currentAndUpcoming.push(result);
      } else {
        acc.past.push({
          ...result,
          hideStatus: true,
        });
      }
      return acc;
    },
    { currentAndUpcoming: [], past: [] } as {
      currentAndUpcoming: ExhibitionBasic[];
      past: ExhibitionBasic[];
    }
  );

  const paginationRoot = `/exhibitions${period ? `/${period}` : ''}`;

  return (
    <PageLayout
      title={title}
      description={pageDescriptions.exhibitions}
      url={{ pathname: paginationRoot }}
      jsonLd={jsonLd}
      openGraphType="website"
      siteSection="whats-on"
      image={firstExhibition && firstExhibition.image}
    >
      <PageHeader
        breadcrumbs={getBreadcrumbItems('whats-on')}
        title={title}
        ContentTypeInfo={
          pageDescriptions.exhibitions && (
            <PrismicHtmlBlock
              html={[
                {
                  type: 'paragraph',
                  text: pageDescriptions.exhibitions,
                  spans: [],
                },
              ]}
            />
          )
        }
        backgroundTexture={headerBackgroundLs}
        highlightHeading={true}
      />
      {partitionedExhibitionItems.currentAndUpcoming.length > 0 && (
        <>
          <Space $v={{ size: 'l', properties: ['margin-bottom'] }}>
            <SectionHeader
              title="Current exhibitions"
              gridSize={gridSize12()}
            />
          </Space>
          <SpacingSection>
            <CardGrid
              items={partitionedExhibitionItems.currentAndUpcoming}
              itemsPerRow={3}
            />
          </SpacingSection>
        </>
      )}

      {partitionedExhibitionItems.past.length > 0 && (
        <>
          {!period && (
            <Space $v={{ size: 'l', properties: ['margin-bottom'] }}>
              <SectionHeader title="Past Exhibitions" gridSize={gridSize12()} />
              <ContaineredLayout gridSizes={gridSize12()}>
                <Space $v={{ size: 'm', properties: ['margin-top'] }}>
                  <p style={{ marginBottom: 0 }}>{pastExhibitionsStrapline}</p>
                </Space>
              </ContaineredLayout>
            </Space>
          )}
          <SpacingSection>
            <CardGrid
              items={partitionedExhibitionItems.past}
              itemsHaveTransparentBackground={true}
              itemsPerRow={3}
            />
            {exhibitions.totalPages > 1 && (
              <Container>
                <PaginationWrapper $verticalSpacing="m" $alignRight>
                  <Pagination
                    totalPages={exhibitions.totalPages}
                    ariaLabel="Exhibitions pagination"
                  />
                </PaginationWrapper>
              </Container>
            )}
          </SpacingSection>
        </>
      )}
    </PageLayout>
  );
};

export default ExhibitionsPage;
