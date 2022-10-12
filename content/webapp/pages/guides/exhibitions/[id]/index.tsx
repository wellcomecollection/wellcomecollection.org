import {
  ExhibitionGuide,
  ExhibitionGuideBasic,
} from '../../../../types/exhibition-guides';
import { FC } from 'react';
import { createClient } from '../../../../services/prismic/fetch';
import {
  fetchExhibitionGuide,
  fetchExhibitionGuides,
} from '../../../../services/prismic/fetch/exhibition-guides';
import {
  transformExhibitionGuide,
  transformExhibitionGuideToExhibitionGuideBasic,
} from '../../../../services/prismic/transformers/exhibition-guides';
import { transformQuery } from '../../../../services/prismic/transformers/paginated-results';
import PageLayout from '@weco/common/views/components/PageLayout/PageLayout';
import { font } from '@weco/common/utils/classnames';
import { removeUndefinedProps } from '@weco/common/utils/json';
import { getServerData } from '@weco/common/server-data';
import { exhibitionGuideLd } from '../../../../services/prismic/transformers/json-ld';
import { pageDescriptions } from '@weco/common/data/microcopy';
import { JsonLdObj } from '@weco/common/views/components/JsonLd/JsonLd';
import { looksLikePrismicId } from '@weco/common/services/prismic';
import Layout10 from '@weco/common/views/components/Layout10/Layout10';
import Space from '@weco/common/views/components/styled/Space';
import SpacingSection from '@weco/common/views/components/SpacingSection/SpacingSection';
import { GetServerSideProps } from 'next';
import { AppErrorProps } from '@weco/common/services/app';
import { exhibitionGuidesLinks } from '@weco/common/views/components/Header/Header';
import OtherExhibitionGuides from 'components/OtherExhibitionGuides/OtherExhibitionGuides';
import ExhibitionGuideLinks from 'components/ExhibitionGuideLinks/ExhibitionGuideLinks';

type Props = {
  exhibitionGuide: ExhibitionGuide;
  jsonLd: JsonLdObj;
  otherExhibitionGuides: ExhibitionGuideBasic[];
};

export const getServerSideProps: GetServerSideProps<Props | AppErrorProps> =
  async context => {
    const serverData = await getServerData(context);
    const { id } = context.query;

    if (!looksLikePrismicId(id) || !serverData.toggles.exhibitionGuides) {
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

    if (!exhibitionGuideQuery) {
      return { notFound: true };
    }

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

    const exhibitionGuide = transformExhibitionGuide(exhibitionGuideQuery);

    const jsonLd = exhibitionGuideLd(exhibitionGuide);

    return {
      props: removeUndefinedProps({
        exhibitionGuide,
        jsonLd,
        serverData,
        otherExhibitionGuides: basicExhibitionGuides.results.filter(
          result => result.id !== id
        ),
      }),
    };
  };

const ExhibitionGuidePage: FC<Props> = ({
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
      image={exhibitionGuide.image || undefined}
      headerProps={{
        customNavLinks: exhibitionGuidesLinks,
        showLibraryLogin: false,
      }}
      hideNewsletterPromo={true}
      hideFooter={true}
    >
      <Layout10 isCentered={false}>
        <SpacingSection>
          <Space
            v={{ size: 'l', properties: ['margin-top'] }}
            className={font('wb', 1)}
          >
            <Space v={{ size: 'm', properties: ['margin-bottom'] }}>
              <h1
                className={font('wb', 0)}
              >{`Choose the ${exhibitionGuide.title} guide for you`}</h1>
            </Space>
          </Space>
          <Space v={{ size: 'l', properties: ['margin-top'] }}>
            <ExhibitionGuideLinks
              availableTypes={exhibitionGuide.availableTypes}
              pathname={pathname}
            />
          </Space>
        </SpacingSection>
      </Layout10>
      {otherExhibitionGuides.length > 0 && (
        <OtherExhibitionGuides otherExhibitionGuides={otherExhibitionGuides} />
      )}
    </PageLayout>
  );
};

export default ExhibitionGuidePage;
