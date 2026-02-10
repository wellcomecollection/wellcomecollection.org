import { FunctionComponent, PropsWithChildren } from 'react';

import { prismicPageIds } from '@weco/common/data/hardcoded-ids';
import { pageDescriptions } from '@weco/common/data/microcopy';
import { ApiToolbarLink } from '@weco/common/views/components/ApiToolbar';
import Space from '@weco/common/views/components/styled/Space';
import PageLayout from '@weco/common/views/layouts/PageLayout';
import { Page } from '@weco/content/types/pages';

import ThematicBrowsingHeader from './ThematicBrowsing.Header';

export type ThematicBrowsingCategories =
  | 'people-and-organisations'
  | 'types-and-techniques'
  | 'subjects'
  | 'places';

type ThematicBrowsingLayoutProps = PropsWithChildren<{
  page: Page;
  currentCategory: ThematicBrowsingCategories;
  subPageUid?: string;
  extraBreadcrumbs?: { url: string; text: string }[];
  apiToolbarLinks?: ApiToolbarLink[]; // TODO add links when we have them
}>;

const ThematicBrowsingLayout: FunctionComponent<
  ThematicBrowsingLayoutProps
> = ({
  children,
  page,
  currentCategory,
  subPageUid,
  extraBreadcrumbs,
  apiToolbarLinks = [],
}) => {
  const urlPathname = `/${prismicPageIds.collections}/${currentCategory}${subPageUid ? `/${subPageUid}` : ''}`;

  return (
    <PageLayout
      openGraphType={'website' as const}
      jsonLd={{ '@type': 'WebPage' }}
      hideNewsletterPromo
      siteSection="collections"
      title={page.title}
      description={
        page.metadataDescription ||
        page.promo?.caption ||
        pageDescriptions.collections.index
      }
      url={{ pathname: urlPathname }}
      image={page.image}
      apiToolbarLinks={apiToolbarLinks}
    >
      <ThematicBrowsingHeader
        title={page.title}
        introText={page.introText}
        extraBreadcrumbs={extraBreadcrumbs}
        currentCategory={currentCategory}
      />
      <Space $v={{ size: 'lg', properties: ['margin-top', 'margin-bottom'] }}>
        {children}
      </Space>
    </PageLayout>
  );
};

export default ThematicBrowsingLayout;
