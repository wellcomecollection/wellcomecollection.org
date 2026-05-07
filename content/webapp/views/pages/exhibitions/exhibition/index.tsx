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
import { ThemeCardsListSliceValue } from '@weco/content/services/prismic/transformers/body';
import { Slice } from '@weco/content/types/body';
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
  themeCardsListSlice?: Slice<'themeCardsList', ThemeCardsListSliceValue>;
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
  themeCardsListSlice,
  jsonLd,
}) => {
  const [relatedContent, setRelatedContent] =
    useState<(ExhibitionType | EventBasic | PageType)[]>(relatedPages);
  const [aboutThisExhibitionContent, setAboutThisExhibitionContent] = useState<
    AboutThisExhibitionContent[]
  >([]);

  const { exhibitionAndCollection } = useToggles();

  useEffect(() => {
    let isMounted = true;

    // Reset state immediately to avoid showing stale data from previous exhibition
    setRelatedContent(relatedPages);
    setAboutThisExhibitionContent([]);

    const ids = exhibition.relatedIds;

    // Short-circuit if no related IDs to avoid unnecessary network request
    if (ids.length === 0) {
      return () => {
        isMounted = false;
      };
    }

    fetchExhibitionRelatedContentClientSide(ids)
      .then(fetchedRelatedContent => {
        if (!isMounted) return;

        if (isNotUndefined(fetchedRelatedContent)) {
          setRelatedContent([
            ...fetchedRelatedContent.relatedExhibitionsAndEvents,
            ...relatedPages,
          ]);
          setAboutThisExhibitionContent(
            fetchedRelatedContent.aboutThisExhibitionContent
          );
        }
        // Else: fetch returned undefined, keep showing just relatedPages
      })
      .catch(() => {
        if (!isMounted) return;
        // On network error, keep showing just relatedPages
      });

    return () => {
      isMounted = false;
    };
  }, [exhibition.id, relatedPages]);

  const isTendernessAndRageExhibition =
    exhibition.id === 'aY8u9xAAACEAIL8z' ||
    exhibition.uid === 'tenderness-and-rage';

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
          shouldHideRelatedStories={
            !!(exhibitionAndCollection && isTendernessAndRageExhibition)
          }
        />
      )}

      {exhibitionAndCollection && (
        <ExhibitionCollectionsContent
          isTendernessAndRageExhibition={isTendernessAndRageExhibition}
          aboutThisExhibitionContent={aboutThisExhibitionContent}
          themeCardsListSlice={themeCardsListSlice}
          videos={exhibition.untransformedPortraitVideos}
        />
      )}
    </PageLayout>
  );
};

export default ExhibitionPage;
