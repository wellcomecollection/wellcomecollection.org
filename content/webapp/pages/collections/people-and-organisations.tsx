import { pageDescriptions } from '@weco/common/data/microcopy';
import { getServerData } from '@weco/common/server-data';
import { serialiseProps } from '@weco/common/utils/json';
import {
  ServerSideProps,
  ServerSidePropsOrAppError,
} from '@weco/common/views/pages/_app';
import { setCacheControl } from '@weco/content/utils/setCacheControl';
import CollectionsPeoplePage, {
  Props as PeopleAndOrganisationsPageProps,
} from '@weco/content/views/pages/collections/people-and-organisations';

type Props = ServerSideProps<PeopleAndOrganisationsPageProps>;

export const getServerSideProps: ServerSidePropsOrAppError<
  Props
> = async context => {
  setCacheControl(context.res);
  const serverData = await getServerData(context);

  if (!serverData.toggles.thematicBrowsing.value) {
    return {
      notFound: true,
    };
  }

  return {
    props: serialiseProps<Props>({
      serverData,
      title: 'People and organisations', // TODO confirm
      description: pageDescriptions.collections.peopleAndOrganisations,
      pageMeta: {
        urlPathname: '/people-and-organisations',
      },
    }),
  };
};

export default CollectionsPeoplePage;
