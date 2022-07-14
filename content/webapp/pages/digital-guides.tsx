// import { DigitalGuideBasic } from '../types/digital-guides';
// import type { PaginatedResults } from '@weco/common/services/prismic/types';
// import { createClient } from '../services/prismic/fetch';
// import { fetchDigitalGuides } from '../services/prismic/fetch/digital-guides';
// import { transformQuery } from '../services/prismic/transformers/paginated-results';
// import {
//   transformDigitalGuide,
//   transformDigitalGuideToDigitalGuideBasic,
// } from '../services/prismic/transformers/digital-guides';
import PageLayout from '@weco/common/views/components/PageLayout/PageLayout';
import { FC } from 'react';
import { GetServerSideProps } from 'next';
import { /* appError, */ AppErrorProps } from '@weco/common/views/pages/_app';
// import { removeUndefinedProps } from '@weco/common/utils/json';
import { getServerData } from '@weco/common/server-data';
// import { digitalGuideLd } from '../services/prismic/transformers/json-ld';
// import { getPage } from '../utils/query-params';
import { pageDescriptions } from '@weco/common/data/microcopy';
// import { JsonLdObj } from '@weco/common/views/components/JsonLd/JsonLd';

// type Props = {
//   digitalGuides: PaginatedResults<DigitalGuideBasic>;
//   jsonLd: JsonLdObj[];
// };

export const getServerSideProps: GetServerSideProps</* Props | */ AppErrorProps> =
  async context => {
    // const page = getPage(context.query);

    // if (typeof page !== 'number') {
    //   return appError(context, 400, page.message);
    // }

    // const client = createClient(context);
    // const digitalGuidesQuery = await fetchDigitalGuides(client, { page });

    // const digitalGuides = transformQuery(digitalGuidesQuery, transformDigitalGuide);
    // const jsonLd = digitalGuides.results.map(digitalGuidesLd);
    // const basicDigitalGuides = {
    //   ...digitalGuides,
    //   results: digitalGuides.results.map(transformDigitalGuideToDigitalGuideBasic),
    // };

    const serverData = await getServerData(context);

    // return {
    //   props: removeUndefinedProps({
    //     digitalGuides: basicDigitalGuides,
    //     jsonLd,
    //     serverData,
    //   }),
    // };
    return {
      props: {
        digitalGuides: [
          {
            title: 'This is a digital guide',
          },
          {
            title: 'This is another digital guide',
          },
        ],
        serverData,
      },
    };
  };

const DigitalGuidesPage: FC /* <Props> */ = ({
  digitalGuides /* jsonLd */,
}) => {
  // const image = digitalGuides.results[0]?.image; // TODO

  return (
    <PageLayout
      title={'Digital Guides'}
      description={pageDescriptions.digitalGuides}
      url={{ pathname: `/digital-guides` }}
      jsonLd={{}} // TODO
      openGraphType={'website'}
      siteSection={'stories'}
      image={undefined} // TODO
    >
      <p>DIGITAL GUIDES</p>
    </PageLayout>
  );
};

export default DigitalGuidesPage;
