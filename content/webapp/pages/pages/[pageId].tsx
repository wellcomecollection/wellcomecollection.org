import { GetServerSideProps } from 'next';
import { FunctionComponent } from 'react';

import { isSiteSection } from '@weco/common/model/site-section';
import { getServerData } from '@weco/common/server-data';
import { SimplifiedServerData } from '@weco/common/server-data/types';
import { AppErrorProps } from '@weco/common/services/app';
import { GaDimensions } from '@weco/common/services/app/analytics-scripts';
import { looksLikePrismicId } from '@weco/common/services/prismic';
import { serialiseProps } from '@weco/common/utils/json';
import { toMaybeString } from '@weco/common/utils/routes';
import { isNotUndefined } from '@weco/common/utils/type-guards';
import { createClient } from '@weco/content/services/prismic/fetch';
import {
  fetchBasicPage,
  fetchChildren,
  fetchPage,
  fetchSiblings,
} from '@weco/content/services/prismic/fetch/pages';
import { contentLd } from '@weco/content/services/prismic/transformers/json-ld';
import { transformPage } from '@weco/content/services/prismic/transformers/pages';
import { Page as PageType } from '@weco/content/types/pages';
import { SiblingsGroup } from '@weco/content/types/siblings-group';
import { setCacheControl } from '@weco/content/utils/setCacheControl';
import PagePage, {
  OrderInParent,
  Props as PagePageProps,
} from '@weco/content/views/pages/page';

type Props = PagePageProps & {
  gaDimensions: GaDimensions;
  serverData: SimplifiedServerData; // TODO should we enforce this?
};

export const Page: FunctionComponent<Props> = (props: PagePageProps) => {
  return <PagePage {...props}>{props.children}</PagePage>;
};

export const getServerSideProps: GetServerSideProps<
  Props | AppErrorProps
> = async context => {
  setCacheControl(context.res);
  const { pageId } = context.query;
  const siteSection = toMaybeString(context.params?.siteSection);

  // We don't allow e.g. /visit-us/visit-us as it's a landing page
  // Should only display on /visit-us
  const isLandingPageRenderingAsSubPage =
    pageId === siteSection &&
    context.resolvedUrl.indexOf(`/${siteSection}/${pageId}`) === 0;

  if (!looksLikePrismicId(pageId) || isLandingPageRenderingAsSubPage) {
    return { notFound: true };
  }

  const client = createClient(context);

  // As our former URL structure for all pages was /pages/, if a user ends up on an old URL
  // We want to redirect them to where the page now is.
  if (context.resolvedUrl.indexOf('/pages/') === 0) {
    const basicDocument = await fetchBasicPage(client, pageId);

    if (isNotUndefined(basicDocument)) {
      const basicDocSiteSection = basicDocument.tags.find(t =>
        isSiteSection(t)
      );
      const isLandingPage = basicDocSiteSection === pageId;

      const redirectUrl =
        isLandingPage || !basicDocSiteSection
          ? `/${pageId}`
          : `/${basicDocSiteSection}/${pageId}`;

      return {
        redirect: {
          destination: redirectUrl,
          permanent: false,
        },
      };
    }
    return { notFound: true };
  }

  const pageDocument = await fetchPage(
    client,
    pageId,
    isSiteSection(siteSection) || siteSection === 'orphan'
      ? siteSection
      : undefined
  );

  // Is valid if document has a tag that matches the one declared in route OR
  // if it has NO SiteSection tags at all (orphan)
  const isInValidSection =
    pageDocument?.tags.find(t => siteSection === t) ||
    !pageDocument?.tags.find(t => isSiteSection(t));

  if (isNotUndefined(pageDocument) && isInValidSection) {
    const serverData = await getServerData(context);

    const page = transformPage(pageDocument);

    const siblings: SiblingsGroup<PageType>[] = (
      await fetchSiblings(client, page)
    ).map(group => {
      return {
        ...group,
        siblings: group.siblings.map(transformPage),
      };
    });
    const ordersInParents: OrderInParent[] =
      page.parentPages?.map(p => {
        return {
          id: p.id,
          uid: p.uid,
          title: p.title,
          order: p.order,
          type: p.type,
          tags: p.tags,
          siteSection: p.siteSection,
        };
      }) || [];

    const children = {
      id: page.id,
      title: page.title,
      siblings: (await fetchChildren(client, page)).map(transformPage),
    };

    const jsonLd = contentLd(page);

    return {
      props: serialiseProps<Props>({
        page,
        siblings,
        children,
        ordersInParents,
        staticContent: null,
        jsonLd,
        serverData,
        gaDimensions: {
          partOf: page.seasons?.map(season => season.id),
        },
      }),
    };
  }

  return { notFound: true };
};

export default Page;
export type { Props };
