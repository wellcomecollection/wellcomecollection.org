import { NextPage } from 'next';

import { getServerData } from '@weco/common/server-data';
import { looksLikePrismicId } from '@weco/common/services/prismic';
import { serialiseProps } from '@weco/common/utils/json';
import { isNotUndefined } from '@weco/common/utils/type-guards';
import {
  ServerSideProps,
  ServerSidePropsOrAppError,
} from '@weco/common/views/pages/_app';
import { createClient } from '@weco/content/services/prismic/fetch';
import { fetchProject } from '@weco/content/services/prismic/fetch/projects';
import { contentLd } from '@weco/content/services/prismic/transformers/json-ld';
import { transformProject } from '@weco/content/services/prismic/transformers/projects';
import { setCacheControl } from '@weco/content/utils/setCacheControl';
import ProjectPage, {
  Props as ProjectPageProps,
} from '@weco/content/views/pages/projects/project';

export const Page: NextPage<ProjectPageProps> = props => {
  return <ProjectPage {...props} />;
};

type Props = ServerSideProps<ProjectPageProps>;

export const getServerSideProps: ServerSidePropsOrAppError<
  Props
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
      props: serialiseProps<Props>({
        project,
        staticContent: null,
        jsonLd,
        serverData,
      }),
    };
  }

  return { notFound: true };
};

export default Page;
