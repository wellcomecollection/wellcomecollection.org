import { ExhibitionGuideBasic } from '../types/exhibition-guides';
import type { PaginatedResults } from '@weco/common/services/prismic/types';
import { createClient } from '../services/prismic/fetch';
import { fetchExhibitionGuides } from '../services/prismic/fetch/exhibition-guides';
// import { transformQuery } from '../services/prismic/transformers/paginated-results';
// import {
//   transformExhibitionGuide,
//   transformExhibitionGuideToExhibitionGuideBasic,
// } from '../services/prismic/transformers/exhibition-guides';
import PageLayout from '@weco/common/views/components/PageLayout/PageLayout';
import { FC } from 'react';
import { GetServerSideProps } from 'next';
import { appError, AppErrorProps } from '@weco/common/views/pages/_app';
import { removeUndefinedProps } from '@weco/common/utils/json';
import { getServerData } from '@weco/common/server-data';
// import { exhibitionGuideLd } from '../services/prismic/transformers/json-ld';
import { getPage } from '../utils/query-params';
import { pageDescriptions } from '@weco/common/data/microcopy';
// import { JsonLdObj } from '@weco/common/views/components/JsonLd/JsonLd';

type Props = {
  exhibitionGuides: PaginatedResults<ExhibitionGuideBasic>;
  // jsonLd: // TODO JsonLdObj[];
};

export const getServerSideProps: GetServerSideProps<Props | AppErrorProps> =
  async context => {
    const serverData = await getServerData(context);
    const page = getPage(context.query);

    if (typeof page !== 'number') {
      return appError(context, 400, page.message);
    }

    const client = createClient(context);
    const exhibitionGuidesQuery = await fetchExhibitionGuides(client, { page });

    const basicExhibitionGuides = exhibitionGuidesQuery;
    // TODO transformQuery(
    //   exhibitionGuidesQuery,
    //   transformExhibitionGuide
    // );
    // const basicExhibitionGuides = {
    //   ...exhibitionGuides,
    //   results: exhibitionGuides.results.map(
    //     transformExhibitionGuideToExhibitionGuideBasic
    //   ),
    // };

    // const jsonLd = exhibitionGuides.results.map(exhibitionGuideLd);

    return {
      props: removeUndefinedProps({
        exhibitionGuides: basicExhibitionGuides,
        jsonLd: { '@type': 'webpage' }, // TODO - what is is the correct type (schema.org) and add the rest of the stuff it should have
        serverData,
      }),
    };
  };

const ExhibitionGuidesPage: FC<Props> = ({ exhibitionGuides /* jsonLd */ }) => {
  // const image = exhibitionGuides.results[0]?.image; // TODO

  return (
    <PageLayout
      title={'Exhibition Guides'}
      description={pageDescriptions.exhibitionGuides}
      url={{ pathname: `/guides/exhibitions` }}
      jsonLd={{ '@type': 'webpage' }} // TODO
      openGraphType={'website'}
      siteSection={'whats-on'}
      image={undefined} // TODO
    >
      <p>EXHIBITION GUIDES</p>
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
          <>{JSON.stringify(exhibitionGuides, null, 1)}</>
        </code>
      </pre>
    </PageLayout>
  );
};

export default ExhibitionGuidesPage;
