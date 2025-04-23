import { GetServerSideProps } from 'next';
import { FunctionComponent, ReactElement } from 'react';

import { getServerData } from '@weco/common/server-data';
import { AppErrorProps } from '@weco/common/services/app';
import { GaDimensions } from '@weco/common/services/app/analytics-scripts';
import { looksLikePrismicId } from '@weco/common/services/prismic';
import { headerBackgroundLs } from '@weco/common/utils/backgrounds';
import { serialiseProps } from '@weco/common/utils/json';
import { isNotUndefined } from '@weco/common/utils/type-guards';
import { createPrismicLink } from '@weco/common/views/components/ApiToolbar';
import { getBreadcrumbItems } from '@weco/common/views/components/Breadcrumb';
import { JsonLdObj } from '@weco/common/views/components/JsonLd';
import { makeLabels } from '@weco/common/views/components/LabelsList';
import PageHeader from '@weco/common/views/components/PageHeader';
import PageLayout from '@weco/common/views/components/PageLayout';
import VideoEmbed from '@weco/common/views/components/VideoEmbed';
import Body from '@weco/content/components/Body';
import ContentPage from '@weco/content/components/ContentPage';
import { getFeaturedPictureWithTasl } from '@weco/content/pages/pages/[pageId]';
import { createClient } from '@weco/content/services/prismic/fetch';
import { fetchProject } from '@weco/content/services/prismic/fetch/projects';
import { transformEmbedSlice } from '@weco/content/services/prismic/transformers/body';
import { contentLd } from '@weco/content/services/prismic/transformers/json-ld';
import { transformProject } from '@weco/content/services/prismic/transformers/projects';
import { isEditorialImage, isVideoEmbed } from '@weco/content/types/body';
import { Project as ProjectType } from '@weco/content/types/projects';
import { setCacheControl } from '@weco/content/utils/setCacheControl';

type ProjectProps = {
  project: ProjectType;
  staticContent: ReactElement | null;
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

  return (
    <PageLayout
      title={project.title}
      description={project.metadataDescription || project.promo?.caption || ''}
      url={{ pathname: `/projects/${project.uid}` }}
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
