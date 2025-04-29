import { GetServerSideProps } from 'next';
import { FunctionComponent } from 'react';

import {
  exhibitionGuideLinkText,
  visualStoryLinkText,
} from '@weco/common/data/microcopy';
import {
  ExhibitionHighlightToursDocument,
  ExhibitionTextsDocument,
} from '@weco/common/prismicio-types';
import { getServerData } from '@weco/common/server-data';
import { AppErrorProps } from '@weco/common/services/app';
import { GaDimensions } from '@weco/common/services/app/analytics-scripts';
import { Pageview } from '@weco/common/services/conversion/track';
import { looksLikePrismicId } from '@weco/common/services/prismic';
import linkResolver from '@weco/common/services/prismic/link-resolver';
import { serialiseProps } from '@weco/common/utils/json';
import { isNotUndefined } from '@weco/common/utils/type-guards';
import { createPrismicLink } from '@weco/common/views/components/ApiToolbar';
import { JsonLdObj } from '@weco/common/views/components/JsonLd';
import PageLayout from '@weco/common/views/components/PageLayout';
import Exhibition from '@weco/content/components/Exhibition';
import Installation from '@weco/content/components/Installation';
import { createClient } from '@weco/content/services/prismic/fetch';
import { fetchExhibition } from '@weco/content/services/prismic/fetch/exhibitions';
import { transformExhibition } from '@weco/content/services/prismic/transformers/exhibitions';
import { exhibitionLd } from '@weco/content/services/prismic/transformers/json-ld';
import { transformPage } from '@weco/content/services/prismic/transformers/pages';
import { transformQuery } from '@weco/content/services/prismic/transformers/paginated-results';
import { Exhibition as ExhibitionType } from '@weco/content/types/exhibitions';
import { Link } from '@weco/content/types/link';
import { Page as PageType } from '@weco/content/types/pages';
import { cacheTTL, setCacheControl } from '@weco/content/utils/setCacheControl';

type ExhibitionProps = {
  exhibition: ExhibitionType;
  jsonLd: JsonLdObj;
  pages: PageType[];
  gaDimensions: GaDimensions;
  pageview: Pageview;
  accessResourceLinks: (Link & { type: string })[];
  exhibitionTexts: ExhibitionTextsDocument[];
  exhibitionHighlightTours: ExhibitionHighlightToursDocument[];
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
  exhibitionTexts,
  exhibitionHighlightTours,
  jsonLd,
}) => {
  return (
    <PageLayout
      title={exhibition.title}
      description={
        exhibition.metadataDescription || exhibition.promo?.caption || ''
      }
      url={{ pathname: `/exhibitions/${exhibition.uid}` }}
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
          exhibitionTexts={exhibitionTexts}
          exhibitionHighlightTours={exhibitionHighlightTours}
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
    const {
      exhibition,
      pages,
      visualStories,
      allGuides,
      exhibitionTexts,
      exhibitionHighlightTours,
    } = exhibitionDocument;

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
        exhibitionTexts,
        exhibitionHighlightTours,
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
