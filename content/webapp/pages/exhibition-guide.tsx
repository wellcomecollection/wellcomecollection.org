import { ExhibitionGuide } from '../types/exhibition-guides';
import { createClient } from '../services/prismic/fetch';
import { fetchExhibitionGuide } from '../services/prismic/fetch/exhibition-guides';
// import { transformQuery } from '../services/prismic/transformers/paginated-results';
import { transformExhibitionGuide } from '../services/prismic/transformers/exhibition-guides';
import PageLayout from '@weco/common/views/components/PageLayout/PageLayout';
import { FC } from 'react';
import { GetServerSideProps } from 'next';
import { /* appError, */ AppErrorProps } from '@weco/common/views/pages/_app'; // TODO
import { removeUndefinedProps } from '@weco/common/utils/json';
import { getServerData } from '@weco/common/server-data';
import { exhibitionGuideLd } from '../services/prismic/transformers/json-ld';
import { pageDescriptions } from '@weco/common/data/microcopy';
import { JsonLdObj } from '@weco/common/views/components/JsonLd/JsonLd';
import { looksLikePrismicId } from '@weco/common/services/prismic';

type Props = {
  exhibitionGuide: ExhibitionGuide;
  id: string;
  jsonLd: JsonLdObj;
  // type: string; // TODO union - content type/guide format
};

export const getServerSideProps: GetServerSideProps<Props | AppErrorProps> =
  async context => {
    const serverData = await getServerData(context);
    const { id } = context.query; // TODO should we have another page template to handle type or do everything in here?
    if (!looksLikePrismicId(id) || !serverData.toggles.exhibitionGuides) {
      return { notFound: true };
    }

    const client = createClient(context);
    const exhibitionGuideDocument = await fetchExhibitionGuide(
      client,
      id as string
    );

    // return {
    //   props: removeUndefinedProps({
    //     exhibitionGuide: {
    //       hierarchyExample: constructHierarchy(testComponentData),
    //     },
    //     // jsonLd, TODO Hierarchy
    //     serverData,
    //   }),
    // };
    if (exhibitionGuideDocument) {
      const exhibitionGuide = transformExhibitionGuide(exhibitionGuideDocument);
      const jsonLd = exhibitionGuideLd(exhibitionGuide);

      return {
        props: removeUndefinedProps({
          exhibitionGuide,
          jsonLd,
          serverData,
        }),
      };
    } else {
      return { notFound: true };
    }
  };

const ExhibitionGuidesPage: FC<Props> = ({
  exhibitionGuide,
  id,
  jsonLd,
  // type, // TODO keep content-types format in Prismic same as we do for Guides, Q. for PR
}) => {
  const pathname = `guides/exhibition/${id}`; // TODO /id/content-type
  return (
    <PageLayout
      title={exhibitionGuide.title}
      description={pageDescriptions.exhibitionGuides}
      url={{ pathname: pathname }}
      jsonLd={jsonLd}
      openGraphType={'website'}
      siteSection={'whats-on'}
      image={undefined} // TODO, linked doc promo image, e.g. Exhibition image
    >
      <p>Wellcome Collection Exhibition guide: {exhibitionGuide.title}</p>
      <pre
        style={{
          maxWidth: '600px',
          margin: '0 auto 24px',
          fontSize: '14px',
        }}
      >
        <code
          style={{
            display: 'block',
            padding: '24px',
            backgroundColor: '#EFE1AA',
            color: '#000',
            border: '4px solid #000',
            borderRadius: '6px',
          }}
        >
          <details>
            <summary>exhibition-guide</summary>
            {/* eslint-disable-next-line no-restricted-syntax */}
            {JSON.stringify(exhibitionGuide, null, 1)}
          </details>
        </code>
      </pre>
    </PageLayout>
  );
};

export default ExhibitionGuidesPage;
