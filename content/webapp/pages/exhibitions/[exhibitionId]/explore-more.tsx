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

type WorkGroupConfig = {
  heading: string;
  description: string;
  ids: string[];
};

const EXHIBITION_WORK_GROUPS: WorkGroupConfig[] = [
  {
    heading: 'ACT UP',
    description:
      '<p>ACT UP (AIDS Coalition to Unleash Power) is an activist group focused on direct action against the AIDS epidemic. Founded in New York in 1987, it expanded into a global network of independent chapters campaigning around HIV.</p><p>This selection features material from chapters in New York, London, Manchester and Paris.</p>',
    ids: ['d2mxjdkb', 'qbb553nf', 'mfmfu73q'],
  },
  {
    heading: 'What Would an HIV Doula Do?',
    description:
      '<p>Founded in 2015, ‘What Would an HIV Doula Do?’ (WWHIVDD) is a collective of artists, activists and practitioners across the HIV spectrum, formed in response to the ongoing AIDS crisis.</p><p>This selection features digital zines created by WWHIVDD in our collection.</p>',
    ids: ['m8xw26qs', 'bd7tnj3t', 'jnvfvwt4'],
  },
  {
    heading: 'HIV Care Centres in London',
    description:
      '<p>At the height of the UK AIDS epidemic, people living with HIV faced stigma, secrecy and hostile media. Care centres stepped in to provide vital support and safe spaces.</p><p>This selection highlights material from London centres, including The Landmark, The Lighthouse and Mildmay Hospital.</p>',
    ids: ['g7dmnpaj', 'ys83vvw5'],
  },
  {
    heading: 'HIV Posters',
    description:
      '<p>Around the world, organisations, charities and activist groups have used posters to raise awareness of HIV and AIDS. From public health campaigns and support services to protest and advocacy, their design often reflects the communities they are made for.</p><p>Below is a selection of posters from around the world in our collection.</p>',
    ids: ['dh98h9g2', 'y2euzack', 'jtfcxa7t'],
  },
];

const EXHIBITION_WORKS_IDS: string[] = ['eudv2vbg', 'gtwbj94b'];

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

  const [workGroups, exhibitionWorks]: [WorkGroup[], WorkBasic[]] =
    await Promise.all([
      Promise.all(
        EXHIBITION_WORK_GROUPS.map(async group => {
          const works = (
            await Promise.all(
              group.ids.map(id => getWork({ id, shouldUseStagingApi }))
            )
          ).flatMap(r => {
            if (r.type === 'Error' || r.type === 'Redirect') return [];
            const { url: _url, ...work } = r;
            return [toWorkBasic(work)];
          });
          return {
            heading: group.heading,
            description: group.description,
            works,
          };
        })
      ),
      Promise.all(
        EXHIBITION_WORKS_IDS.map(id => getWork({ id, shouldUseStagingApi }))
      ).then(results =>
        results.flatMap(r => {
          if (r.type === 'Error' || r.type === 'Redirect') return [];
          const { url: _url, ...work } = r;
          return [toWorkBasic(work)];
        })
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
