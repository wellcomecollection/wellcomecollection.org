import { GetServerSideProps } from 'next';
import { FunctionComponent } from 'react';

import { getServerData } from '@weco/common/server-data';
import { SimplifiedServerData } from '@weco/common/server-data/types';
import { AppErrorProps } from '@weco/common/services/app';
import { looksLikePrismicId } from '@weco/common/services/prismic';
import { serialiseProps } from '@weco/common/utils/json';
import { isNotUndefined } from '@weco/common/utils/type-guards';
import { createClient } from '@weco/content/services/prismic/fetch';
import { fetchProject } from '@weco/content/services/prismic/fetch/projects';
import { contentLd } from '@weco/content/services/prismic/transformers/json-ld';
import { transformProject } from '@weco/content/services/prismic/transformers/projects';
import { setCacheControl } from '@weco/content/utils/setCacheControl';
import ProjectPage, {
  Props as ProjectPageProps,
} from '@weco/content/views/projects/project';

type Props = ProjectPageProps & {
  serverData: SimplifiedServerData; // TODO should we enforce this?
};

export const Project: FunctionComponent<ProjectPageProps> = props => {
  return <ProjectPage {...props} />;
};

export const getServerSideProps: GetServerSideProps<
  Props | AppErrorProps
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

export default Project;
