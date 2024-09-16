import { GetServerSideProps } from 'next';
import { FunctionComponent, ReactElement } from 'react';
import { getFeaturedPictureWithTasl } from '@weco/content/pages/pages/[pageId]';
import { AppErrorProps } from '@weco/common/services/app';
import { setCacheControl } from '@weco/content/utils/setCacheControl';
import { looksLikePrismicId } from '@weco/common/services/prismic';
import { createClient } from '@weco/content/services/prismic/fetch';
import { transformProject } from '@weco/content/services/prismic/transformers/projects';
import { isNotUndefined } from '@weco/common/utils/type-guards';
import { getServerData } from '@weco/common/server-data';
import { contentLd } from '@weco/content/services/prismic/transformers/json-ld';
import { serialiseProps } from '@weco/common/utils/json';
import { Project as ProjectType } from '@weco/content/types/projects';
import { JsonLdObj } from '@weco/common/views/components/JsonLd/JsonLd';
import { GaDimensions } from '@weco/common/services/app/analytics-scripts';
import PageLayout from '@weco/common/views/components/PageLayout/PageLayout';
import ContentPage from '@weco/content/components/ContentPage/ContentPage';
import { createPrismicLink } from '@weco/common/views/components/ApiToolbar';
import PageHeader from '@weco/common/views/components/PageHeader/PageHeader';
import VideoEmbed from '@weco/common/views/components/VideoEmbed/VideoEmbed';
import { transformEmbedSlice } from '@weco/content/services/prismic/transformers/body';
import { isEditorialImage, isVideoEmbed } from '@weco/content/types/body';
import { headerBackgroundLs } from '@weco/common/utils/backgrounds';
import Body from '@weco/content/components/Body/Body';
import { fetchProject } from '@weco/content/services/prismic/fetch/projects';
import { makeLabels } from '@weco/common/views/components/LabelsList/LabelsList';
import { getBreadcrumbItems } from '@weco/common/views/components/Breadcrumb/Breadcrumb';
import { isVanityUrl } from '@weco/content/utils/urls';

type ProjectProps = {
  project: ProjectType;
  staticContent: ReactElement | null;
  vanityUrl?: string | undefined;
  jsonLd: JsonLdObj;
  gaDimensions: GaDimensions;
};

export const getServerSideProps: GetServerSideProps<
  ProjectProps | AppErrorProps
> = async context => {
  setCacheControl(context.res);
  const { projectId } = context.query;

  if (!looksLikePrismicId(projectId)) {
    return { notFound: true };
  }

  const client = createClient(context);

  const vanityUrl = isVanityUrl(projectId, context.resolvedUrl)
    ? context.resolvedUrl
    : undefined;

  const projectDocument = await fetchProject(client, projectId);

  if (isNotUndefined(projectDocument)) {
    const project = transformProject(projectDocument);

    const serverData = await getServerData(context);

    const jsonLd = contentLd(project);

    return {
      props: serialiseProps({
        project,
        staticContent: null,
        jsonLd,
        serverData,
        vanityUrl,
        gaDimensions: {
          partOf: project.seasons?.map(season => season.id),
        },
      }),
    };
  }

  return { notFound: true };
};

export const Project: FunctionComponent<ProjectProps> = ({
  project,
  staticContent,
  vanityUrl,
  jsonLd,
}) => {
  const featuredPicture =
    project.untransformedBody.length > 1 &&
    isEditorialImage(project.untransformedBody[0])
      ? project.untransformedBody[0]
      : undefined;

  const featuredVideo =
    project.untransformedBody.length > 1 &&
    isVideoEmbed(project.untransformedBody[0])
      ? project.untransformedBody[0]
      : undefined;

  const transformFeaturedVideo =
    featuredVideo && transformEmbedSlice(featuredVideo);

  const hasFeaturedMedia =
    isNotUndefined(featuredPicture) || isNotUndefined(featuredVideo);

  const untransformedBody = hasFeaturedMedia
    ? project.untransformedBody.slice(1, project.untransformedBody.length)
    : project.untransformedBody;

  const featuredMedia = featuredPicture ? (
    getFeaturedPictureWithTasl(featuredPicture)
  ) : transformFeaturedVideo ? (
    <VideoEmbed {...transformFeaturedVideo.value} />
  ) : undefined;

  const Header = (
    <PageHeader
      breadcrumbs={getBreadcrumbItems(project.siteSection)}
      labels={makeLabels(project.format?.title)}
      title={project.title}
      FeaturedMedia={featuredMedia}
      backgroundTexture={!featuredMedia ? headerBackgroundLs : undefined}
      highlightHeading={true}
      isContentTypeInfoBeforeMedia={false}
    />
  );

  // If we have a vanity URL, we prefer that for the link rel="canonical"
  // in the page <head>; it means the canonical URL will match the links
  // we put elsewhere on the website, e.g. in the header.
  const pathname = vanityUrl || `/projects/${project.uid}`;

  return (
    <PageLayout
      title={project.title}
      description={project.metadataDescription || project.promo?.caption || ''}
      url={{ pathname }}
      jsonLd={jsonLd}
      openGraphType="website"
      image={project.image}
      apiToolbarLinks={[createPrismicLink(project.id)]}
    >
      <ContentPage
        id={project.id}
        Header={Header}
        Body={
          <Body
            untransformedBody={untransformedBody}
            pageId={project.id}
            staticContent={staticContent}
          />
        }
        seasons={project.seasons}
        contributors={project.contributors}
      />
    </PageLayout>
  );
};

export default Project;
