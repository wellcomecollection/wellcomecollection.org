// import { ExhibitionGuide } from '../types/exhibition-guides';
// import { createClient } from '../services/prismic/fetch';
// import { fetchExhibitionGuide } from '../services/prismic/fetch/exhibition-guides';
// import { transformQuery } from '../services/prismic/transformers/paginated-results';
// import {
//   transformExhibitionGuide,
// } from '../services/prismic/transformers/guides';
import PageLayout from '@weco/common/views/components/PageLayout/PageLayout';
import { FC } from 'react';
import { GetServerSideProps } from 'next';
import { /* appError, */ AppErrorProps } from '@weco/common/views/pages/_app'; // TODO
import { removeUndefinedProps } from '@weco/common/utils/json';
import { getServerData } from '@weco/common/server-data';
// import { exhibitionGuideLd } from '../services/prismic/transformers/json-ld';
import { pageDescriptions } from '@weco/common/data/microcopy';
import { JsonLdObj } from '@weco/common/views/components/JsonLd/JsonLd';
import { looksLikePrismicId } from '@weco/common/services/prismic';

type Props = {
  exhibitionGuide: any; // TODO ExhibitionGuide;
  id: string; // TODO PrismicId?
  jsonLd: JsonLdObj[];
  type: string; // TODO union
};

export const getServerSideProps: GetServerSideProps<
  /* TODO Props */ any | AppErrorProps
> = async context => {
  const { id /* type */ } = context.query; // TODO should we have another page template to handle type or do everything in here?

  if (!looksLikePrismicId(id)) {
    return { notFound: true };
  }

  // const client = createClient(context);
  // const exhibitionGuideDocument = await fetchExhibitionGuide(client, id as string);
  const exhibitionGuideDocument = true;

  if (exhibitionGuideDocument) {
    // const exhibitionGuide = transformExhibitionGuide(exhibitionGuideDocument);
    // const jsonLd = exhibitionGuideLd(exhibitionGuide);
    const serverData = await getServerData(context);

    return {
      props: removeUndefinedProps({
        exhibitionGuide: {
          title: 'This is an exhibition guide',
        },
        // jsonLd, TODO
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
  type, // TODO keep types format in Prismic same as we do for Guides, Q. for PR
  /* jsonLd */ // TODO
}) => {
  const pathname = '/guides/exhibitions/'; // TODO /id/type
  return (
    <PageLayout
      title={'Exhibition Guide'} // TODO title
      description={pageDescriptions.exhibitionGuides} // TODO
      url={{ pathname: pathname }}
      jsonLd={{ '@type': 'WebPage' }} // TODO, get jsonLd properly and what is the correct type
      openGraphType={'website'}
      siteSection={'collections'}
      image={undefined} // TODO, linked doc promo image, e.g. Exhibition image
    >
      <p>EXHIBITION GUIDE</p>
    </PageLayout>
  );
};

export default ExhibitionGuidesPage;
