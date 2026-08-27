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
  archiveCategoryWorksSortFields,
  fetchArchiveCategoryWorks,
} from '@weco/content/services/wellcome/catalogue/works';
import { getPage } from '@weco/content/utils/query-params';
import { setCacheControl } from '@weco/content/utils/setCacheControl';
import ArchiveCategoryPage, {
  Props as ArchiveCategoryPageProps,
} from '@weco/content/views/pages/collections/archives/archive-category';

const Page: NextPage<ArchiveCategoryPageProps> = props => {
  return <ArchiveCategoryPage {...props} />;
};

type Props = ServerSideProps<ArchiveCategoryPageProps>;

export const getServerSideProps: ServerSidePropsOrAppError<
  Props
> = async context => {
  setCacheControl(context.res);
  const serverData = await getServerData(context);

  if (!serverData.toggles.featureFlags.archiveBrowsing) {
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

  const { sort: sortQuery, sortOrder: sortOrderQuery } = context.query;
  // sortOrder alone (e.g. from a shared URL) still implies a sort field, so
  // treat the two as explicit together rather than letting one imply a real
  // API sort order while the other silently stays at its "no sort" default
  const isExplicitSort =
    archiveCategoryWorksSortFields.some(field => field === sortQuery) ||
    sortOrderQuery === 'asc' ||
    sortOrderQuery === 'desc';
  const sort = isExplicitSort ? archiveCategoryWorksSortFields[0] : undefined;
  const sortOrder = isExplicitSort
    ? sortOrderQuery === 'asc'
      ? 'asc'
      : 'desc'
    : undefined;

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
