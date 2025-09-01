import { ReactElement } from 'react';

import { SimplifiedServerData } from '@weco/common/server-data/types';
import { createPrismicLink } from '@weco/common/views/components/ApiToolbar';
import { JsonLdObj } from '@weco/common/views/components/JsonLd';
import SpacingComponent from '@weco/common/views/components/styled/SpacingComponent';
import SpacingSection from '@weco/common/views/components/styled/SpacingSection';
import PageLayout from '@weco/common/views/layouts/PageLayout';
import { ArticleBasic } from '@weco/content/types/articles';
import { BookBasic } from '@weco/content/types/books';
import { EventBasic } from '@weco/content/types/events';
import { ExhibitionBasic } from '@weco/content/types/exhibitions';
import { Page } from '@weco/content/types/pages';
import { Project } from '@weco/content/types/projects';
import { Season } from '@weco/content/types/seasons';
import { Series } from '@weco/content/types/series';
import Body from '@weco/content/views/components/Body';
import CardGrid from '@weco/content/views/components/CardGrid';
import ContentPage from '@weco/content/views/components/ContentPage';

import SeasonsHeader from './season.Header';

export type Props = {
  season: Season;
  articles: ArticleBasic[];
  books: BookBasic[];
  events: EventBasic[];
  exhibitions: ExhibitionBasic[];
  pages: Page[];
  projects: Project[];
  series: Series[];
  jsonLd: JsonLdObj;
  serverData: SimplifiedServerData;
};

const SeasonPage = ({
  season,
  articles,
  events,
  exhibitions,
  pages,
  series,
  projects,
  books,
  jsonLd,
  serverData,
}: Props): ReactElement => {
  const allItems = [
    ...exhibitions,
    ...events,
    ...articles,
    ...pages,
    ...series,
    ...projects,
    ...books,
  ];

  return (
    <PageLayout
      title={season.title}
      description={season.metadataDescription || season.promo?.caption || ''}
      url={{ pathname: `/seasons/${season.uid}` }}
      jsonLd={jsonLd}
      siteSection="whats-on"
      openGraphType="website"
      image={season.image}
      apiToolbarLinks={[createPrismicLink(season.id)]}
    >
      <ContentPage
        id={season.id}
        contentApiType="seasons"
        serverData={serverData}
        Header={<SeasonsHeader season={season} />}
        Body={
          <Body
            untransformedBody={season.untransformedBody}
            pageId={season.id}
          />
        }
        hideContributors={true}
      />

      {allItems.length > 0 && (
        <SpacingSection>
          <SpacingComponent>
            <CardGrid items={allItems} itemsPerRow={3} />
          </SpacingComponent>
        </SpacingSection>
      )}
    </PageLayout>
  );
};

export default SeasonPage;
