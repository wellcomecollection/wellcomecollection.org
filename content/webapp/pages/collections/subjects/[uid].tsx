import { prismicPageIds } from '@weco/common/data/hardcoded-ids';
import { PagesDocument as RawPagesDocument } from '@weco/common/prismicio-types';
import { getServerData } from '@weco/common/server-data';
import { serialiseProps } from '@weco/common/utils/json';
import { getQueryPropertyValue } from '@weco/common/utils/search';
import { isNotUndefined } from '@weco/common/utils/type-guards';
import {
  ServerSideProps,
  ServerSidePropsOrAppError,
} from '@weco/common/views/pages/_app';
import { createClient } from '@weco/content/services/prismic/fetch';
import { fetchPage } from '@weco/content/services/prismic/fetch/pages';
import { transformPage } from '@weco/content/services/prismic/transformers/pages';
import { setCacheControl } from '@weco/content/utils/setCacheControl';
import WellcomeSubThemePage, {
  Props as WellcomeSubThemePageProps,
} from '@weco/content/views/pages/collections/subjects/sub-theme';

type Props = ServerSideProps<WellcomeSubThemePageProps>;

export const getServerSideProps: ServerSidePropsOrAppError<
  Props
> = async context => {
  setCacheControl(context.res);
  const serverData = await getServerData(context);

  // Ensure this is a valid subject page
  // TODO grow list when "core concepts" are officialised
  const subjectsEnum = ['military-and-war'];
  const pageUid = getQueryPropertyValue(context.query.uid);

  if (
    !serverData.toggles.thematicBrowsing.value ||
    !pageUid ||
    !subjectsEnum.includes(pageUid)
  ) {
    return {
      notFound: true,
    };
  }

  const client = createClient(context);
  const wellcomeSubThemePagePromise = await fetchPage(
    client,
    'subjects-' + pageUid
  );

  if (isNotUndefined(wellcomeSubThemePagePromise)) {
    const wellcomeSubThemePage = transformPage(
      wellcomeSubThemePagePromise as RawPagesDocument
    );

    return {
      props: serialiseProps<Props>({
        serverData,
        pageMeta: {
          prismicId: wellcomeSubThemePage.id,
          image: wellcomeSubThemePage.promo?.image,
          description: wellcomeSubThemePage.promo?.caption,
          url: {
            pathname: `/${prismicPageIds.collections}/subjects/${pageUid}`,
            query: {},
          },
        },
        title: wellcomeSubThemePage.title,
        introText: wellcomeSubThemePage.introText ?? [],
      }),
    };
  }

  return { notFound: true };
};

export default WellcomeSubThemePage;
