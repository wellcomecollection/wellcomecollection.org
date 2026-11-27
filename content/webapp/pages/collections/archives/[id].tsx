import { NextPage } from 'next';

import { getServerData } from '@weco/common/server-data';
import { appError } from '@weco/common/services/app';
import { serialiseProps } from '@weco/common/utils/json';
import { isString } from '@weco/common/utils/type-guards';
import {
  ServerSideProps,
  ServerSidePropsOrAppError,
} from '@weco/common/views/pages/_app';
import { getArchiveCategories } from '@weco/content/server-data/archiveCategories';
import {
  fetchArchiveCategoryWorks,
  getArchiveCategoryWorksSort,
} from '@weco/content/services/wellcome/catalogue/works';
import { getPage } from '@weco/content/utils/query-params';
import { setCacheControl } from '@weco/content/utils/setCacheControl';
import ArchiveCategoryPage, {
  Props as ArchiveCategoryPageProps,
} from '@weco/content/views/pages/collections/archives/archive-category';
import { phaseIsAtLeast } from '@weco/toggles';

const Page: NextPage<ArchiveCategoryPageProps> = props => {
  return <ArchiveCategoryPage {...props} />;
};

type Props = ServerSideProps<ArchiveCategoryPageProps>;

export const getServerSideProps: ServerSidePropsOrAppError<
  Props
> = async context => {
  setCacheControl(context.res);
  const serverData = await getServerData(context);

  if (
    !phaseIsAtLeast(serverData.toggles.phasedFlags.archiveBrowsingPhases, 'mvp')
  ) {
    return { notFound: true };
  }

  const { id } = context.query;
  if (!isString(id)) {
    return { notFound: true };
  }

  const page = getPage(context.query);
  if (typeof page !== 'number') {
    return appError(context, 400, page.message);
  }

  const archiveCategories = await getArchiveCategories();
  const archiveCategory = archiveCategories.find(
    category => category.slug === id.toLowerCase()
  );
  if (!archiveCategory) {
    return { notFound: true };
  }

  const { sort, sortOrder } = getArchiveCategoryWorksSort({
    sort: context.query.sort,
    sortOrder: context.query.sortOrder,
  });

  const works = await fetchArchiveCategoryWorks({
    id: archiveCategory.id,
    page,
    sort,
    sortOrder,
  });

  if ('type' in works) {
    return appError(
      context,
      works.httpStatus,
      works.description || works.label
    );
  }

  return {
    props: serialiseProps<Props>({
      serverData,
      archiveCategory,
      otherArchiveCategories: archiveCategories.filter(
        category => category.id !== archiveCategory.id
      ),
      works,
      sort,
      sortOrder,
      apiToolbarLinks: [
        {
          id: 'catalogue-api',
          label: 'Catalogue API query',
          link: works.requestUrl,
        },
      ],
    }),
  };
};

export default Page;
