import { ExhibitionGuide } from '../types/exhibition-guides';
import { createClient } from '../services/prismic/fetch';
import { fetchExhibitionGuide } from '../services/prismic/fetch/exhibition-guides';
import { transformExhibitionGuide } from '../services/prismic/transformers/exhibition-guides';
import PageLayout from '@weco/common/views/components/PageLayout/PageLayout';
import { FC } from 'react';
import { removeUndefinedProps } from '@weco/common/utils/json';
import { getServerData } from '@weco/common/server-data';
import { exhibitionGuideLd } from '../services/prismic/transformers/json-ld';
import { pageDescriptions } from '@weco/common/data/microcopy';
import { JsonLdObj } from '@weco/common/views/components/JsonLd/JsonLd';
import { looksLikePrismicId } from '@weco/common/services/prismic';
import Layout10 from '@weco/common/views/components/Layout10/Layout10';
import Space from '@weco/common/views/components/styled/Space';
import ExhibitionCaptions from '../components/ExhibitionCaptions/ExhibitionCaptions';
import { GetServerSideProps } from 'next';
import { AppErrorProps } from '@weco/common/views/pages/_app';

const typeNames = [
  'bsl',
  'audio-with-description',
  'audio-without-description',
  'captions-and-transcripts',
] as const;
type GuideType = typeof typeNames[number];

type Props = {
  exhibitionGuide: ExhibitionGuide;
  jsonLd: JsonLdObj;
  type?: GuideType;
};

function isValidType(type) {
  return typeNames.includes(type);
}

export const getServerSideProps: GetServerSideProps<Props | AppErrorProps> =
  async context => {
    const serverData = await getServerData(context);
    if (!looksLikePrismicId(id) || !serverData.toggles.exhibitionGuides) {
    const { id, type } = context.query;
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

      return {
        props: removeUndefinedProps({
          exhibitionGuide,
          jsonLd,
          serverData,
          type: isValidType(type) ? (type as GuideType) : undefined,
        }),
      };
    } else {
      return { notFound: true };
    }
  };

const ExhibitionGuidesPage: FC<Props> = props => {
  const pathname = `guides/exhibition/${exhibitionGuide.id}`; // TODO /id/content-type
  const { exhibitionGuide, jsonLd, type } = props;
  return (
    <PageLayout
      title={exhibitionGuide.title || ''}
      description={pageDescriptions.exhibitionGuides}
      url={{ pathname: pathname }}
      jsonLd={jsonLd}
      openGraphType={'website'}
      siteSection={'whats-on'}
      image={exhibitionGuide.image || undefined}
    >
      <Layout10>
        <Space v={{ size: 'xl', properties: ['margin-top'] }}>
          <h2>{exhibitionGuide.title}</h2>
        </Space>
        <Space v={{ size: 'xl', properties: ['margin-top'] }}>
          <h3>Introduction</h3>
          {exhibitionGuide.relatedExhibition && (
            <p>{exhibitionGuide.relatedExhibition.description}</p>
          )}
        </Space>
        <Space v={{ size: 'xl', properties: ['margin-top'] }}>
          <ExhibitionCaptions
            stops={exhibitionGuide.components}
          ></ExhibitionCaptions>
        </Space>
      </Layout10>
    </PageLayout>
  );
};

export default ExhibitionGuidesPage;
