import { GetServerSideProps } from 'next';
import { FunctionComponent } from 'react';

import { getServerData } from '@weco/common/server-data';
import { AppErrorProps } from '@weco/common/services/app';
import { looksLikePrismicId } from '@weco/common/services/prismic';
import { headerBackgroundLs } from '@weco/common/utils/backgrounds';
import { serialiseProps } from '@weco/common/utils/json';
import { isNotUndefined } from '@weco/common/utils/type-guards';
import { createPrismicLink } from '@weco/common/views/components/ApiToolbar';
import { getBreadcrumbItems } from '@weco/common/views/components/Breadcrumb/Breadcrumb';
import HeaderBackground from '@weco/common/views/components/HeaderBackground/HeaderBackground';
import { HTMLDate } from '@weco/common/views/components/HTMLDateAndTime';
import { JsonLdObj } from '@weco/common/views/components/JsonLd/JsonLd';
import { makeLabels } from '@weco/common/views/components/LabelsList/LabelsList';
import PageHeader from '@weco/common/views/components/PageHeader/PageHeader';
import PageLayout, {
  SiteSection,
} from '@weco/common/views/components/PageLayout/PageLayout';
import VideoEmbed from '@weco/common/views/components/VideoEmbed/VideoEmbed';
import Body from '@weco/content/components/Body/Body';
import ContentPage from '@weco/content/components/ContentPage/ContentPage';
import { getFeaturedPictureWithTasl } from '@weco/content/pages/pages/[pageId]';
import { createClient } from '@weco/content/services/prismic/fetch';
import { fetchGuide } from '@weco/content/services/prismic/fetch/guides';
import { transformEmbedSlice } from '@weco/content/services/prismic/transformers/body';
import { transformGuide } from '@weco/content/services/prismic/transformers/guides';
import { contentLd } from '@weco/content/services/prismic/transformers/json-ld';
import { isEditorialImage, isVideoEmbed } from '@weco/content/types/body';
import { Guide as GuideType } from '@weco/content/types/guides';
import { setCacheControl } from '@weco/content/utils/setCacheControl';
import { isVanityUrl } from '@weco/content/utils/urls';

export type Props = {
  guide: GuideType;
  vanityUrl?: string;
  jsonLd: JsonLdObj;
};

export const getServerSideProps: GetServerSideProps<
  Props | AppErrorProps
> = async context => {
  setCacheControl(context.res);
  const { guideId } = context.query;

  if (!looksLikePrismicId(guideId)) {
    return { notFound: true };
  }

  const client = createClient(context);

  const vanityUrl = isVanityUrl(guideId, context.resolvedUrl)
    ? context.resolvedUrl
    : undefined;

  const guideDocument = await fetchGuide(client, guideId);

  if (isNotUndefined(guideDocument)) {
    const guide = transformGuide(guideDocument);
    const serverData = await getServerData(context);

    const jsonLd = contentLd(guide);

    return {
      props: serialiseProps({
        guide,
        jsonLd,
        serverData,
        vanityUrl,
      }),
    };
  }

  return { notFound: true };
};

export const Guide: FunctionComponent<Props> = ({
  guide,
  vanityUrl,
  jsonLd,
}) => {
  const DateInfo = guide.datePublished && (
    <HTMLDate date={guide.datePublished} />
  );

  const featuredPicture =
    guide.untransformedBody.length > 1 &&
    isEditorialImage(guide.untransformedBody[0])
      ? guide.untransformedBody[0]
      : undefined;

  const featuredVideo =
    guide.untransformedBody.length > 1 &&
    isVideoEmbed(guide.untransformedBody[0])
      ? guide.untransformedBody[0]
      : undefined;

  const transformFeaturedVideo =
    featuredVideo && transformEmbedSlice(featuredVideo);

  const hasFeaturedMedia =
    isNotUndefined(featuredPicture) || isNotUndefined(featuredVideo);

  const untransformedBody = hasFeaturedMedia
    ? guide.untransformedBody.slice(1, guide.untransformedBody.length)
    : guide.untransformedBody;

  const featuredMedia = featuredPicture ? (
    getFeaturedPictureWithTasl(featuredPicture)
  ) : transformFeaturedVideo ? (
    <VideoEmbed {...transformFeaturedVideo.value} />
  ) : undefined;

  const displayBackground = featuredMedia ? (
    <HeaderBackground backgroundTexture={headerBackgroundLs} />
  ) : undefined;

  const Header = (
    <PageHeader
      breadcrumbs={getBreadcrumbItems(guide.siteSection)}
      labels={makeLabels(guide.format?.title)}
      title={guide.title}
      FeaturedMedia={featuredMedia}
      Background={displayBackground}
      ContentTypeInfo={DateInfo}
      backgroundTexture={!featuredMedia ? headerBackgroundLs : undefined}
      highlightHeading={true}
      isContentTypeInfoBeforeMedia={false}
    />
  );

  // If we have a vanity URL, we prefer that for the link rel="canonical"
  // in the page <head>; it means the canonical URL will match the links
  // we put elsewhere on the website, e.g. in the header.
  const pathname = vanityUrl || `/guides/${guide.uid}`;

  return (
    <PageLayout
      title={guide.title}
      description={guide.metadataDescription || guide.promo?.caption || ''}
      url={{ pathname }}
      jsonLd={jsonLd}
      openGraphType="website"
      siteSection={guide?.siteSection as SiteSection}
      image={guide.image}
      apiToolbarLinks={[createPrismicLink(guide.id)]}
    >
      <ContentPage
        id={guide.id}
        Header={Header}
        Body={
          <Body
            untransformedBody={untransformedBody}
            pageId={guide.id}
            onThisPage={guide.onThisPage}
            showOnThisPage={guide.showOnThisPage}
          />
        }
      />
    </PageLayout>
  );
};

export default Guide;
