import { NextPage } from 'next';
import { useEffect, useState } from 'react';

import {
  ExhibitionHighlightToursDocument,
  ExhibitionTextsDocument,
} from '@weco/common/prismicio-types';
import { useToggles } from '@weco/common/server-data/Context';
import { isNotUndefined } from '@weco/common/utils/type-guards';
import { createPrismicLink } from '@weco/common/views/components/ApiToolbar';
import { JsonLdObj } from '@weco/common/views/components/JsonLd';
import PageLayout from '@weco/common/views/layouts/PageLayout';
import { fetchExhibitionRelatedContentClientSide } from '@weco/content/services/prismic/fetch/exhibitions';
import { EventBasic } from '@weco/content/types/events';
import {
  AboutThisExhibitionContent,
  Exhibition as ExhibitionType,
} from '@weco/content/types/exhibitions';
import { Link } from '@weco/content/types/link';
import { Page as PageType } from '@weco/content/types/pages';

import ExhibitionCollectionsContent from './exhibition.Collections';
import Exhibition from './exhibition.Exhibition';
import Installation from './exhibition.Installation';

export type Props = {
  exhibition: ExhibitionType;
  jsonLd: JsonLdObj;
  relatedPages: PageType[];
  accessResourceLinks: (Link & { type: string })[];
  exhibitionTexts: ExhibitionTextsDocument[];
  exhibitionHighlightTours: ExhibitionHighlightToursDocument[];
};

/**
 * Please note that the /exhibitions/{period} routes do not arrive here
 * but instead are rewritten to the index file. Please observe
 * this setup in the next.config file for this app
 */
const ExhibitionPage: NextPage<Props> = ({
  exhibition,
  relatedPages,
  accessResourceLinks,
  exhibitionTexts,
  exhibitionHighlightTours,
  jsonLd,
}) => {
  const [relatedContent, setRelatedContent] = useState<
    (ExhibitionType | EventBasic | PageType)[]
  >([]);
  const [aboutThisExhibitionContent, setAboutThisExhibitionContent] = useState<
    AboutThisExhibitionContent[]
  >([]);

  const { exhibitionAndCollection } = useToggles();

  useEffect(() => {
    const ids = exhibition.relatedIds;

    fetchExhibitionRelatedContentClientSide(ids).then(fetchedRelatedContent => {
      if (isNotUndefined(fetchedRelatedContent)) {
        setRelatedContent([
          ...fetchedRelatedContent.relatedExhibitionsAndEvents,
          ...relatedPages,
        ]);
        setAboutThisExhibitionContent(
          fetchedRelatedContent.aboutThisExhibitionContent
        );
      }
    });
  }, [exhibition.relatedIds, relatedPages]);

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
        <Installation
          installation={exhibition}
          relatedContent={relatedContent}
          aboutThisExhibitionContent={aboutThisExhibitionContent}
        />
      ) : (
        <Exhibition
          exhibition={exhibition}
          relatedContent={relatedContent}
          aboutThisExhibitionContent={aboutThisExhibitionContent}
          accessResourceLinks={accessResourceLinks}
          exhibitionTexts={exhibitionTexts}
          exhibitionHighlightTours={exhibitionHighlightTours}
        />
      )}

      {exhibitionAndCollection && (
        <ExhibitionCollectionsContent
          isTendernessAndRageExhibition={exhibition.id === 'aY8u9xAAACEAIL8z'}
          aboutThisExhibitionContent={aboutThisExhibitionContent}
          conceptIds={[]}
          videos={[]}
        />
      )}
    </PageLayout>
  );
};

export default ExhibitionPage;
