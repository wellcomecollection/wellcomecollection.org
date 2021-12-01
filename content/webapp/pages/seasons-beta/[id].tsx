import { GetServerSideProps } from 'next';
import { ReactElement } from 'react';
import PageLayout from '@weco/common/views/components/PageLayout/PageLayout';
import ContentPage from '@weco/common/views/components/ContentPage/ContentPage';
import SeasonsHeader from '../../components/SeasonsHeader/SeasonsHeader';
import { contentLd } from '@weco/common/utils/json-ld';
import { removeUndefinedProps } from '@weco/common/utils/json';
import SpacingSection from '@weco/common/views/components/SpacingSection/SpacingSection';
import SpacingComponent from '@weco/common/views/components/SpacingComponent/SpacingComponent';
import { AppErrorProps } from '@weco/common/views/pages/_app';
import { getServerData } from '@weco/common/server-data';
import {
  getSeason,
  SeasonPrismicDocument,
} from '../../services/prismic/seasons';
import { createClient } from '../../services/prismic/client';
import { Article } from '@weco/common/model/articles';
import { Book } from '@weco/common/model/books';
import { Event } from '@weco/common/model/events';
import { Exhibition } from '@weco/common/model/exhibitions';
import { Page } from '@weco/common/model/pages';
import { ArticleSeries } from '@weco/common/model/article-series';
import { Project } from '@weco/common/model/projects';
import {
  transformLabels,
  transformMeta,
} from '../../services/prismic/transformers';
import { getImageUrlAtSize } from '../../services/prismic/images';
import PrismicImage from 'components/PrismicImage/PrismicImage';
import CardGrid from '../../components/CardGrid/CardGrid';
import Body from '../../components/Body/Body';
import { isString } from '@weco/common/utils/array';

type Props = {
  season: SeasonPrismicDocument;
  events?: Event[];
  exhibitions?: Exhibition[];
  articles?: Article[];
  books?: Book[];
  pages?: Page[];
  articleSeries?: ArticleSeries[];
  projects?: Project[];
};

const SeasonPage = ({ season }: Props): ReactElement<Props> => {
  const start = season.data.start ? new Date(season.data.start) : undefined;
  const end = season.data.end ? new Date(season.data.end) : undefined;
  const meta = transformMeta(season);
  const labels = transformLabels(season);
  const relatedContent = [];

  return (
    <PageLayout
      title={meta.title}
      description={meta.description ?? ''}
      url={{ pathname: meta.url }}
      jsonLd={contentLd(season)}
      siteSection={'whats-on'}
      openGraphType={meta.type}
      imageUrl={meta.image && getImageUrlAtSize(meta.image, { w: 600 })}
      // The type here is `string | undefined | null` as `alt: string | null`
      // because prismic does actually return `null` and `image?: Image`.
      // I'm okay with this here as it's at the edge of the application and it exposed further on
      // as our standard `undefined` for None values.
      // TODO: think of a way to deal with Prismic `null` values.
      imageAltText={meta.image?.alt ?? undefined}
    >
      <ContentPage
        id={season.id}
        Header={
          <SeasonsHeader
            labels={{ labels }}
            title={meta.title}
            FeaturedMedia={
              meta.image?.['32:15'] ? (
                <PrismicImage image={meta.image['32:15']} />
              ) : null
            }
            standfirst={null}
            start={start}
            end={end}
          />
        }
        Body={<Body body={[]} pageId={season.id} />}
      />

      {relatedContent.length > 0 && (
        <SpacingSection>
          <SpacingComponent>
            <CardGrid items={relatedContent} itemsPerRow={3} />
          </SpacingComponent>
        </SpacingSection>
      )}
    </PageLayout>
  );
};

export const getServerSideProps: GetServerSideProps<Props | AppErrorProps> =
  async context => {
    const { id } = context.query;
    if (!isString(id)) {
      return { notFound: true };
    }

    const client = createClient(context);
    const season = await getSeason(client, id);
    const serverData = await getServerData(context);

    if (season) {
      return {
        props: removeUndefinedProps({
          season,
          serverData,
        }),
      };
    } else {
      return { notFound: true };
    }
  };

export default SeasonPage;
