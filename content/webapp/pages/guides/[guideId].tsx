import { GetServerSideProps } from 'next';
import { FunctionComponent, ReactElement } from 'react';
import PageLayout, {
  SiteSection,
} from '@weco/common/views/components/PageLayout/PageLayout';
import { HTMLDate } from '@weco/common/views/components/HTMLDateAndTime';
import HeaderBackground from '@weco/common/views/components/HeaderBackground/HeaderBackground';
import PageHeader from '@weco/common/views/components/PageHeader/PageHeader';
import VideoEmbed from '@weco/common/views/components/VideoEmbed/VideoEmbed';
import { headerBackgroundLs } from '@weco/common/utils/backgrounds';
import { AppErrorProps } from '@weco/common/services/app';
import { serialiseProps } from '@weco/common/utils/json';
import { getServerData } from '@weco/common/server-data';
import Body from '@weco/content/components/Body/Body';
import ContentPage from '@weco/content/components/ContentPage/ContentPage';
import { contentLd } from '@weco/content/services/prismic/transformers/json-ld';
import { createClient } from '@weco/content/services/prismic/fetch';
import { isEditorialImage, isVideoEmbed } from '@weco/content/types/body';
import { isNotUndefined } from '@weco/common/utils/type-guards';
import { JsonLdObj } from '@weco/common/views/components/JsonLd/JsonLd';
import { looksLikePrismicId } from '@weco/common/services/prismic';
import { createPrismicLink } from '@weco/common/views/components/ApiToolbar';
import { setCacheControl } from '@weco/content/utils/setCacheControl';
import { transformEmbedSlice } from '@weco/content/services/prismic/transformers/body';
import { transformGuide } from '@weco/content/services/prismic/transformers/guides';
import { isVanityUrl } from '@weco/content/utils/urls';
import { makeLabels } from '@weco/common/views/components/LabelsList/LabelsList';
import { Guide as GuideType } from '@weco/content/types/guides';
import { fetchGuide } from '@weco/content/services/prismic/fetch/guides';
import { getFeaturedPictureWithTasl } from '../pages/[pageId]';
import { getBreadcrumbItems } from '@weco/common/views/components/Breadcrumb/Breadcrumb';

export type Props = {
  guide: GuideType;
  staticContent: ReactElement | null;
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

  const pageDocument = await fetchGuide(client, guideId);

  const guide = transformGuide(pageDocument);

  if (isNotUndefined(guide)) {
    const serverData = await getServerData(context);

    const jsonLd = contentLd(guide);

    return {
      props: serialiseProps({
        guide,
        staticContent: null,
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
  staticContent,
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
  const pathname = vanityUrl || `/guides/${guide.id}`;

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
            staticContent={staticContent}
          />
        }
      />
    </PageLayout>
  );
};

export default Guide;
