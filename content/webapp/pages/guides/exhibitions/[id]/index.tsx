import { GetServerSideProps } from 'next';
import { FunctionComponent } from 'react';
import {
  ExhibitionGuide,
  ExhibitionGuideBasic,
} from '@weco/content/types/exhibition-guides';
import { createClient } from '@weco/content/services/prismic/fetch';
import {
  fetchExhibitionGuide,
  fetchExhibitionGuides,
} from '@weco/content/services/prismic/fetch/exhibition-guides';
import {
  transformExhibitionGuide,
  transformExhibitionGuideToExhibitionGuideBasic,
} from '@weco/content/services/prismic/transformers/exhibition-guides';
import { transformQuery } from '@weco/content/services/prismic/transformers/paginated-results';
import PageLayout from '@weco/common/views/components/PageLayout/PageLayout';
import { font } from '@weco/common/utils/classnames';
import { serialiseProps } from '@weco/common/utils/json';
import { getServerData } from '@weco/common/server-data';
import { exhibitionGuideLd } from '@weco/content/services/prismic/transformers/json-ld';
import { pageDescriptions } from '@weco/common/data/microcopy';
import { JsonLdObj } from '@weco/common/views/components/JsonLd/JsonLd';
import { looksLikePrismicId } from '@weco/common/services/prismic';
import Layout, { gridSize10 } from '@weco/common/views/components/Layout';
import Space from '@weco/common/views/components/styled/Space';
import SpacingSection from '@weco/common/views/components/styled/SpacingSection';
import { AppErrorProps } from '@weco/common/services/app';
import { exhibitionGuidesLinks } from '@weco/common/views/components/Header/Header';
import OtherExhibitionGuides from '@weco/content/components/OtherExhibitionGuides/OtherExhibitionGuides';
import ExhibitionGuideLinks from '@weco/content/components/ExhibitionGuideLinks/ExhibitionGuideLinks';
import { createPrismicLink } from '@weco/common/views/components/ApiToolbar';
import { setCacheControl } from '@weco/content/utils/setCacheControl';
import { isNotUndefined } from '@weco/common/utils/type-guards';

type Props = {
  exhibitionGuide: ExhibitionGuide;
  jsonLd: JsonLdObj;
  otherExhibitionGuides: ExhibitionGuideBasic[];
};

export const getServerSideProps: GetServerSideProps<
  Props | AppErrorProps
> = async context => {
  setCacheControl(context.res);
  const { id } = context.query;

  if (!looksLikePrismicId(id)) {
    return { notFound: true };
  }

  const client = createClient(context);
  const exhibitionGuideQueryPromise = fetchExhibitionGuide(client, id);
  const exhibitionGuidesQueryPromise = fetchExhibitionGuides(client, {
    page: 1,
  });

  const [exhibitionGuideQuery, exhibitionGuidesQuery] = await Promise.all([
    exhibitionGuideQueryPromise,
    exhibitionGuidesQueryPromise,
  ]);

  if (isNotUndefined(exhibitionGuideQuery)) {
    const serverData = await getServerData(context);

    const exhibitionGuides = transformQuery(
      exhibitionGuidesQuery,
      transformExhibitionGuide
    );

    const basicExhibitionGuides = {
      ...exhibitionGuides,
      results: exhibitionGuides.results.map(
        transformExhibitionGuideToExhibitionGuideBasic
      ),
    };

    // We don't need to send data about individual components to the page, so
    // remove it here.
    const exhibitionGuide = {
      ...transformExhibitionGuide(exhibitionGuideQuery),
      components: [],
    };

    const jsonLd = exhibitionGuideLd(exhibitionGuide);

    return {
      props: serialiseProps({
        exhibitionGuide,
        jsonLd,
        serverData,
        otherExhibitionGuides: basicExhibitionGuides.results.filter(
          result => result.id !== id
        ),
      }),
    };
  }

  return { notFound: true };
};

const ExhibitionGuidePage: FunctionComponent<Props> = ({
  exhibitionGuide,
  jsonLd,
  otherExhibitionGuides,
}) => {
  const pathname = `guides/exhibitions/${exhibitionGuide.id}`;
  return (
    <PageLayout
      title={exhibitionGuide.title}
      description={pageDescriptions.exhibitionGuides}
      url={{ pathname }}
      jsonLd={jsonLd}
      openGraphType="website"
      siteSection="exhibition-guides"
      image={exhibitionGuide.image}
      headerProps={{
        customNavLinks: exhibitionGuidesLinks,
        isMinimalHeader: true,
      }}
      apiToolbarLinks={[createPrismicLink(exhibitionGuide.id)]}
      hideNewsletterPromo={true}
    >
      <Layout gridSizes={gridSize10(false)}>
        <SpacingSection>
          <Space
            $v={{ size: 'l', properties: ['margin-top'] }}
            className={font('wb', 1)}
          >
            <Space $v={{ size: 'm', properties: ['margin-bottom'] }}>
              <h1
                className={font('wb', 0)}
              >{`Choose the ${exhibitionGuide.title} guide for you`}</h1>
            </Space>
          </Space>
          <Space $v={{ size: 'l', properties: ['margin-top'] }}>
            <ExhibitionGuideLinks
              availableTypes={exhibitionGuide.availableTypes}
              pathname={pathname}
            />
          </Space>
        </SpacingSection>
      </Layout>
      {otherExhibitionGuides.length > 0 && (
        <OtherExhibitionGuides otherExhibitionGuides={otherExhibitionGuides} />
      )}
    </PageLayout>
  );
};

export default ExhibitionGuidePage;
