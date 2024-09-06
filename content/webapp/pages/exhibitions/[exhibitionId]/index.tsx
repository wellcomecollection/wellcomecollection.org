import { FunctionComponent } from 'react';
import { GetServerSideProps } from 'next';
import { Page as PageType } from '@weco/content/types/pages';
import Exhibition from '@weco/content/components/Exhibition/Exhibition';
import { Exhibition as ExhibitionType } from '@weco/content/types/exhibitions';
import Installation from '@weco/content/components/Installation/Installation';
import { AppErrorProps } from '@weco/common/services/app';
import { GaDimensions } from '@weco/common/services/app/analytics-scripts';
import { serialiseProps } from '@weco/common/utils/json';
import { getServerData } from '@weco/common/server-data';
import { createClient } from '@weco/content/services/prismic/fetch';
import { fetchExhibition } from '@weco/content/services/prismic/fetch/exhibitions';
import { transformQuery } from '@weco/content/services/prismic/transformers/paginated-results';
import { transformPage } from '@weco/content/services/prismic/transformers/pages';
import { transformExhibition } from '@weco/content/services/prismic/transformers/exhibitions';
import { looksLikePrismicId } from '@weco/common/services/prismic';
import { exhibitionLd } from '@weco/content/services/prismic/transformers/json-ld';
import { JsonLdObj } from '@weco/common/views/components/JsonLd/JsonLd';
import { Pageview } from '@weco/common/services/conversion/track';
import PageLayout from '@weco/common/views/components/PageLayout/PageLayout';
import { createPrismicLink } from '@weco/common/views/components/ApiToolbar';
import { cacheTTL, setCacheControl } from '@weco/content/utils/setCacheControl';
import linkResolver from '@weco/common/services/prismic/link-resolver';
import { Link } from '@weco/content/types/link';
import useHotjar from '@weco/content/hooks/useHotjar';

import {
  visualStoryLinkText,
  exhibitionGuideLinkText,
} from '@weco/common/data/microcopy';
import { isNotUndefined } from '@weco/common/utils/type-guards';

type ExhibitionProps = {
  exhibition: ExhibitionType;
  jsonLd: JsonLdObj;
  pages: PageType[];
  gaDimensions: GaDimensions;
  pageview: Pageview;
  accessResourceLinks: (Link & { type: string })[];
};

/**
 * Please note that the /exhibitions/{period} routes do not arrive here
 * but instead are rewritten to the index file. Please observe
 * this setup in the next.config file for this app
 */
const ExhibitionPage: FunctionComponent<ExhibitionProps> = ({
  exhibition,
  pages,
  accessResourceLinks,
  jsonLd,
}) => {
  // Switch over to new Jason exhibition guide ID
  // https://github.com/wellcomecollection/wellcomecollection.org/issues/11131
  useHotjar(exhibition.id === 'ZZP8BxAAALeD00jo'); // Only on Jason and the Adventure of 254

  return (
    <PageLayout
      title={exhibition.title}
      description={
        exhibition.metadataDescription || exhibition.promo?.caption || ''
      }
      url={{ pathname: `/exhibitions/${exhibition.id}` }}
      jsonLd={jsonLd}
      openGraphType="website"
      siteSection="whats-on"
      image={exhibition.image}
      apiToolbarLinks={[createPrismicLink(exhibition.id)]}
    >
      {exhibition.format && exhibition.format.title === 'Installation' ? (
        <Installation installation={exhibition} />
      ) : (
        <Exhibition
          exhibition={exhibition}
          pages={pages}
          accessResourceLinks={accessResourceLinks}
        />
      )}
    </PageLayout>
  );
};

export const getServerSideProps: GetServerSideProps<
  ExhibitionProps | AppErrorProps
> = async context => {
  setCacheControl(context.res, cacheTTL.events);
  const { exhibitionId } = context.query;

  if (!looksLikePrismicId(exhibitionId)) {
    return { notFound: true };
  }

  const client = createClient(context);
  const exhibitionDocument = await fetchExhibition(client, exhibitionId);

  if (isNotUndefined(exhibitionDocument?.exhibition)) {
    const { exhibition, pages, visualStories, allGuides } = exhibitionDocument;

    const serverData = await getServerData(context);
    const exhibitionDoc = transformExhibition(exhibition);
    const relatedPages = transformQuery(pages, transformPage);

    const visualStoriesLinks = visualStories.results.map(visualStory => {
      const url = linkResolver(visualStory);
      return {
        text: visualStoryLinkText,
        url,
        type: 'visual-story',
      };
    });

    const exhibitionGuidesLinks = allGuides.map(exhibitionGuide => {
      const url = linkResolver(exhibitionGuide);
      return {
        text: exhibitionGuideLinkText,
        url,
        type: 'exhibition-guide',
      };
    });

    const jsonLd = exhibitionLd(exhibitionDoc);

    return {
      props: serialiseProps({
        exhibition: exhibitionDoc,
        pages: relatedPages?.results || [],
        accessResourceLinks: [...exhibitionGuidesLinks, ...visualStoriesLinks],
        jsonLd,
        serverData,
        gaDimensions: {
          partOf: exhibitionDoc.seasons.map(season => season.id),
        },
        pageview: {
          name: 'exhibition',
          properties: {},
        },
      }),
    };
  }

  return { notFound: true };
};

export default ExhibitionPage;
