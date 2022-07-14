// import { DigitalGuide } from '../types/digital-guides';
// import { createClient } from '../services/prismic/fetch';
// import { fetchDigitalGuide } from '../services/prismic/fetch/digital-guides';
// import { transformQuery } from '../services/prismic/transformers/paginated-results';
// import {
//   transformDigitalGuide,
// } from '../services/prismic/transformers/guides';
import PageLayout from '@weco/common/views/components/PageLayout/PageLayout';
import { FC } from 'react';
import { GetServerSideProps } from 'next';
import { /* appError, */ AppErrorProps } from '@weco/common/views/pages/_app'; // TODO
import { removeUndefinedProps } from '@weco/common/utils/json';
import { getServerData } from '@weco/common/server-data';
// import { digitalGuideLd } from '../services/prismic/transformers/json-ld';
import { pageDescriptions } from '@weco/common/data/microcopy';
// import { JsonLdObj } from '@weco/common/views/components/JsonLd/JsonLd';
import { looksLikePrismicId } from '@weco/common/services/prismic';

// type Props = {
//   guide: DigitalGuide;
//   jsonLd: JsonLdObj[];
// };

export const getServerSideProps: GetServerSideProps<
  /* TODO Props */ any | AppErrorProps
> = async context => {
  const { id /* type */ } = context.query; // TODO should we have another page template to handle type or do everything in here?

  if (!looksLikePrismicId(id)) {
    return { notFound: true };
  }

  // const client = createClient(context);
  // const digitalGuideDocument = await fetchDigitalGuide(client, id as string);
  const digitalGuideDocument = true;

  if (digitalGuideDocument) {
    // const digitalGuide = transformDigitalGuide(digitalGuideDocument);
    // const jsonLd = digitalGuideLd(digitalGuide);
    const serverData = await getServerData(context);

    return {
      props: removeUndefinedProps({
        digitalGuide: {
          title: 'This is a digital guide',
        },
        // jsonLd, TODO
        serverData,
      }),
    };
  } else {
    return { notFound: true };
  }
};

const DigitalGuidesPage: FC /* <Props> */ = ({
  digitalGuide,
  id,
  type, // TODO keep types format in Prismic same as we do for Guides, Q. for PR
  /* jsonLd */ // TODO
}) => {
  const pathname = 'digital-guides/'; // TODO /id/type
  return (
    <PageLayout
      title={'Digital Guide'} // TODO title
      description={pageDescriptions.digitalGuides} // TODO
      url={{ pathname: pathname }}
      jsonLd={{ '@type': 'WebPage' }} // TODO, get jsonLd properly and what is the correct type
      openGraphType={'website'}
      siteSection={'collections'}
      image={undefined} // TODO, linked doc promo image, e.g. Exhibition image
    >
      <p>DIGITAL GUIDE</p>
    </PageLayout>
  );
};

export default DigitalGuidesPage;
