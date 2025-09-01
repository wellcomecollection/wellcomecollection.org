import { NextPage } from 'next';
import { ReactElement } from 'react';

import { SimplifiedServerData } from '@weco/common/server-data/types';
import { headerBackgroundLs } from '@weco/common/utils/backgrounds';
import { isNotUndefined } from '@weco/common/utils/type-guards';
import { createPrismicLink } from '@weco/common/views/components/ApiToolbar';
import { getBreadcrumbItems } from '@weco/common/views/components/Breadcrumb';
import { JsonLdObj } from '@weco/common/views/components/JsonLd';
import { makeLabels } from '@weco/common/views/components/LabelsList';
import PageHeader from '@weco/common/views/components/PageHeader';
import VideoEmbed from '@weco/common/views/components/VideoEmbed';
import PageLayout from '@weco/common/views/layouts/PageLayout';
import { transformEmbedSlice } from '@weco/content/services/prismic/transformers/body';
import { isEditorialImage, isVideoEmbed } from '@weco/content/types/body';
import { Project as ProjectType } from '@weco/content/types/projects';
import Body from '@weco/content/views/components/Body';
import ContentPage from '@weco/content/views/components/ContentPage';
import { getFeaturedPictureWithTasl } from '@weco/content/views/components/ImageWithTasl';

export type Props = {
  project: ProjectType;
  staticContent: ReactElement | null;
  jsonLd: JsonLdObj;
  serverData: SimplifiedServerData;
};

export const ProjectPage: NextPage<Props> = ({
  project,
  staticContent,
  jsonLd,
  serverData,
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
        contentApiType="projects"
        serverData={serverData}
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

export default ProjectPage;
