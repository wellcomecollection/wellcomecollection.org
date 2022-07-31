import {
  ExhibitionGuide,
  ExhibitionGuideFormat,
} from '../types/exhibition-guides';
import { createClient } from '../services/prismic/fetch';
import { fetchExhibitionGuide } from '../services/prismic/fetch/exhibition-guides';
// import { transformQuery } from '../services/prismic/transformers/paginated-results';
import { transformExhibitionGuide } from '../services/prismic/transformers/exhibition-guides';
import PageLayout from '@weco/common/views/components/PageLayout/PageLayout';
import React, { FC } from 'react';
import { GetServerSideProps } from 'next';
import { AppErrorProps } from '@weco/common/views/pages/_app';
import { removeUndefinedProps } from '@weco/common/utils/json';
import { getServerData } from '@weco/common/server-data';
import { exhibitionGuideLd } from '../services/prismic/transformers/json-ld';
import { pageDescriptions } from '@weco/common/data/microcopy';
import { JsonLdObj } from '@weco/common/views/components/JsonLd/JsonLd';
import { looksLikePrismicId } from '@weco/common/services/prismic';
import { Page as PageType } from '../types/pages';
import Layout10 from '@weco/common/views/components/Layout10/Layout10';
import Space from '@weco/common/views/components/styled/Space';

type Props = {
  exhibitionGuide: ExhibitionGuide;
  jsonLd: JsonLdObj;
  pages: PageType[];
  format: ExhibitionGuideFormat[];
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
    if (exhibitionGuideDocument) {
      const exhibitionGuide = transformExhibitionGuide(exhibitionGuideDocument);

      const jsonLd = exhibitionGuideLd(exhibitionGuide);
      const format =
        'audio-with-description' |
        'audio-without-description' |
        'bsl-video' |
        'transcript';

      return {
        props: removeUndefinedProps({
          exhibitionGuide,
          jsonLd,
          format,
          serverData,
        }),
      };
    } else {
      return { notFound: true };
    }
  };

const ExhibitionGuidesPage: FC<Props> = ({
  exhibitionGuide,
  jsonLd,
  format,
  // type, // TODO keep content-types format in Prismic same as we do for Guides, Q. for PR
}) => {
  const pathname = `guides/exhibition/${exhibitionGuide.id}/${format}`; // TODO /id/content-type
  const { components } = exhibitionGuide;

  return (
    <PageLayout
      title={exhibitionGuide.title || ''}
      description={pageDescriptions.exhibitionGuides}
      url={{ pathname: pathname }}
      jsonLd={jsonLd}
      openGraphType={'website'}
      siteSection={'whats-on'}
      image={undefined} // TODO, linked doc promo image, e.g. Exhibition image
    >
      <Layout10>
        <Space v={{ size: 'xl', properties: ['margin-top'] }}>
          <h2>{exhibitionGuide.title || ''}</h2>
        </Space>
        <h3>{exhibitionGuide.relatedExhibition?.promo?.caption || ''}</h3>
        <Space v={{ size: 'xl', properties: ['margin-top'] }}>
          {components.map((stop, index) => (
            <p key={index}>{stop.title}</p>
          ))}
        </Space>
      </Layout10>
    </PageLayout>
  );
};

export default ExhibitionGuidesPage;
