// import { ExhibitionGuide } from '../types/exhibition-guides';
import { createClient } from '../services/prismic/fetch';
import { fetchExhibitionGuide } from '../services/prismic/fetch/exhibition-guides';
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
import groupBy from 'lodash.groupby';
// TODO rename all exhibitionGuide(s) things to exhibitionGuide(s)
type Props = {
  exhibitionGuide: any; // TODO ExhibitionGuide;
  id: string; // TODO PrismicId?
  jsonLd: JsonLdObj[];
  type: string; // TODO union
};

// TODO Model maybe we could do away with number field? - would need hasNumber field instead
const testComponentData = [
  {
    title: 'Section One',
    partOf: undefined,
  },
  { title: 'Stop One', partOf: 'Section One' },

  { title: 'Stop Two', partOf: 'Section One' },
  {
    title: 'Sub Section One',
    partOf: 'Section One',
  },
  { title: 'Stop Three', partOf: 'Sub Section One' },
  { title: 'Stop Four', partOf: 'Sub Section One' },
  {
    title: 'Sub sub Section One',
    partOf: 'Sub Section One',
  },
  { title: 'Stop Five', partOf: 'Sub sub Section One' },
  { title: 'Stop Six', partOf: undefined }, // 'Sub sub Section One' // TODO stop it breaking if this happens
  {
    title: 'Sub Section Two',
    partOf: 'Section One',
  },
  { title: 'Stop Seven', partOf: 'Sub Section Two' },
  { title: 'Stop Eight', partOf: 'Section One' },
];

// expect
// [
//   {
//     title: 'Section One',
//     contains: [
//       { title: 'Stop One' },
//       { title: 'Stop Two' },
//       {
//         title: 'Sub Section One',
//         contains: [
//           { title: 'Stop Three' },
//           { title: 'Stop Four' },
//           {
//             title: 'Sub Sub Section One',
//             contains: [{ title: 'Stop Five' }, { title: 'Stop Six' }],
//           },
//         ],
//       },
//       {
//         title: 'Sub Section Two',
//         contains: [{ title: 'Stop Seven' }],
//       },
//     ],
//   },
//   { title: 'Stop Eight' },
// ];

// TODO this function will become part of the transform code
// TODO write some tests for this function
// try different ordering
// try some without partOf
function constructHierarchy(testComponentData) {
  // TODO we'll need this if we want to create accordian menus for sections etc.
  // TODO type function
  // TODO what happens if partOf left off other stuff? - could we use order to determine with guide or should be part of Guide
  // if first item it is Guide, subsequent items are part of guide
  const groupedSections = groupBy(testComponentData, component => {
    const partOf = component.partOf;
    if (!partOf) {
      return 'Guide';
    }
    return partOf;
  });
  const levels = Object.keys(groupedSections).length;
  for (let level = 0; level < levels; level++) {
    for (const [key, value] of Object.entries(groupedSections)) {
      const itemsWithParts = value.map(item => {
        const { partOf, ...restOfItem } = item;
        return {
          ...restOfItem,
          parts: groupedSections[item.title],
        };
      });
      groupedSections[key] = itemsWithParts;
    }
  }

  return groupedSections?.['Guide'];
}

export const getServerSideProps: GetServerSideProps<
  /* TODO Props */ any | AppErrorProps
> = async context => {
  const serverData = await getServerData(context);
  const { id /* type */ } = context.query; // TODO should we have another page template to handle type or do everything in here?

  if (!looksLikePrismicId(id)) {
    return { notFound: true };
  }

  const client = createClient(context);
  const exhibitionGuideDocument = await fetchExhibitionGuide(
    client,
    id as string
  );

  return {
    props: removeUndefinedProps({
      exhibitionGuide: {
        hierarchyExample: constructHierarchy(testComponentData),
      },
      // jsonLd, TODO
      serverData,
    }),
  };
  // if (exhibitionGuideDocument) {
  //   // const exhibitionGuide = transformExhibitionGuide(exhibitionGuideDocument);
  //   // const jsonLd = exhibitionGuideLd(exhibitionGuide);

  //   return {
  //     props: removeUndefinedProps({
  //       exhibitionGuide: {
  //         title: 'This is a exhibition guide',
  //       },
  //       // jsonLd, TODO
  //       serverData,
  //     }),
  //   };
  // } else {
  //   return { notFound: true };
  // }
};

const ExhibitionGuidesPage: FC<Props> = ({
  exhibitionGuide,
  id,
  type, // TODO keep types format in Prismic same as we do for Guides, Q. for PR
  /* jsonLd */ // TODO
}) => {
  const pathname = 'guides/exhibitions/'; // TODO /id/type
  return (
    <PageLayout
      title={'Exhibition Guide'} // TODO title
      description={pageDescriptions.exhibitionGuides} // TODO
      url={{ pathname: pathname }}
      jsonLd={{ '@type': 'WebPage' }} // TODO, get jsonLd properly and what is the correct type
      openGraphType={'website'}
      siteSection={'whats-on'}
      image={undefined} // TODO, linked doc promo image, e.g. Exhibition image
    >
      <p>EXHIBITION GUIDE</p>
      <p>Input:</p>
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
          <>{JSON.stringify(testComponentData, null, 1)}</>
        </code>
      </pre>
      <p>Output:</p>
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
          <>{JSON.stringify(exhibitionGuide.hierarchyExample, null, 1)}</>
        </code>
      </pre>
    </PageLayout>
  );
};

export default ExhibitionGuidesPage;
