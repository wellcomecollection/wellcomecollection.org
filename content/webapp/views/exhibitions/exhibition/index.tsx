import { FunctionComponent } from 'react';

import {
  ExhibitionHighlightToursDocument,
  ExhibitionTextsDocument,
} from '@weco/common/prismicio-types';
import { createPrismicLink } from '@weco/common/views/components/ApiToolbar';
import { JsonLdObj } from '@weco/common/views/components/JsonLd';
import PageLayout from '@weco/common/views/layouts/PageLayout';
import { Exhibition as ExhibitionType } from '@weco/content/types/exhibitions';
import { Link } from '@weco/content/types/link';
import { Page as PageType } from '@weco/content/types/pages';

import Exhibition from './exhibition.Exhibition';
import Installation from './exhibition.Installation';

export type Props = {
  exhibition: ExhibitionType;
  jsonLd: JsonLdObj;
  pages: PageType[];
  accessResourceLinks: (Link & { type: string })[];
  exhibitionTexts: ExhibitionTextsDocument[];
  exhibitionHighlightTours: ExhibitionHighlightToursDocument[];
};

/**
 * Please note that the /exhibitions/{period} routes do not arrive here
 * but instead are rewritten to the index file. Please observe
 * this setup in the next.config file for this app
 */
const ExhibitionPage: FunctionComponent<Props> = ({
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
        <Installation installation={exhibition} pages={pages} />
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

export default ExhibitionPage;
