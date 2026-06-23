import { NextPage } from 'next';

import { getKioskContentKey } from '@weco/common/contexts/KioskContext';
import {
  kioskExhibitionUids,
  kiosksContent,
} from '@weco/common/contexts/KioskContext/kiosks-content';
import { getServerData } from '@weco/common/server-data';
import { looksLikePrismicId } from '@weco/common/services/prismic';
import { serialiseProps } from '@weco/common/utils/json';
import { isNotUndefined } from '@weco/common/utils/type-guards';
import {
  ServerSideProps,
  ServerSidePropsOrAppError,
} from '@weco/common/views/pages/_app';
import { createClient } from '@weco/content/services/prismic/fetch';
import { fetchExhibition } from '@weco/content/services/prismic/fetch/exhibitions';
import { fetchPage } from '@weco/content/services/prismic/fetch/pages';
import { transformExhibition } from '@weco/content/services/prismic/transformers/exhibitions';
import { exhibitionLd } from '@weco/content/services/prismic/transformers/json-ld';
import { transformPage } from '@weco/content/services/prismic/transformers/pages';
import {
  toWorkBasic,
  WorkBasic,
} from '@weco/content/services/wellcome/catalogue/types';
import { getWork } from '@weco/content/services/wellcome/catalogue/works';
import { cacheTTL, setCacheControl } from '@weco/content/utils/setCacheControl';
import ExploreMorePage, {
  Props as ExploreMorePageProps,
  WorkGroup,
} from '@weco/content/views/pages/exhibitions/explore-more';

const Page: NextPage<ExploreMorePageProps> = props => {
  return <ExploreMorePage {...props} />;
};

type Props = ServerSideProps<ExploreMorePageProps>;

export const getServerSideProps: ServerSidePropsOrAppError<
  Props
> = async context => {
  setCacheControl(context.res, cacheTTL.events);
  const { exhibitionId } = context.query;

  const serverData = await getServerData(context);

  // TODO: this is temporary and should be removed when we're happy with the
  // page
  if (!serverData.toggles.modes.kioskMode) {
    return { notFound: true };
  }

  if (!looksLikePrismicId(exhibitionId)) {
    return { notFound: true };
  }

  const client = createClient(context);
  const exhibitionDocument = await fetchExhibition(client, exhibitionId);

  if (!isNotUndefined(exhibitionDocument?.exhibition)) {
    return { notFound: true };
  }

  const { exhibition } = exhibitionDocument;
  const exhibitionDoc = transformExhibition(exhibition);

  const pageDocument = await fetchPage(
    client,
    `${exhibitionDoc.uid}-explore-more`
  );

  if (!pageDocument) {
    return { notFound: true };
  }

  const shouldUseStagingApi = serverData.toggles.featureFlags.stagingApi;

  const contentKey =
    getKioskContentKey(serverData.toggles.modes.kioskMode, kiosksContent) ??
    Object.entries(kioskExhibitionUids).find(
      ([, uid]) => uid === exhibitionDoc.uid
    )?.[0];
  const kioskContent = contentKey ? kiosksContent[contentKey] : undefined;
  const workGroupConfigs = kioskContent?.workGroups ?? [];
  const includedWorkIds = kioskContent?.includedWorks ?? [];

  const resolveWork = (r: Awaited<ReturnType<typeof getWork>>) => {
    if (r.type === 'Error' || r.type === 'Redirect') return [];
    const { url: _url, ...work } = r;
    return [toWorkBasic(work)];
  };

  const [workGroups, exhibitionWorks]: [WorkGroup[], WorkBasic[]] =
    await Promise.all([
      Promise.all(
        workGroupConfigs.map(async group => {
          const results = await Promise.allSettled(
            group.ids.map(id => getWork({ id, shouldUseStagingApi }))
          );
          const works = results.flatMap(r =>
            r.status === 'fulfilled' ? resolveWork(r.value) : []
          );
          return {
            heading: group.heading,
            description: group.description,
            works,
          };
        })
      ),
      Promise.allSettled(
        includedWorkIds.map(id => getWork({ id, shouldUseStagingApi }))
      ).then(results =>
        results.flatMap(r =>
          r.status === 'fulfilled' ? resolveWork(r.value) : []
        )
      ),
    ]);

  const jsonLd = exhibitionLd(exhibitionDoc);

  return {
    props: serialiseProps<Props>({
      exhibition: exhibitionDoc,
      page: transformPage(pageDocument),
      jsonLd,
      workGroups,
      exhibitionWorks,
      serverData,
    }),
  };
};

export default Page;
