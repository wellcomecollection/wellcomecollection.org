import { FunctionComponent, PropsWithChildren } from 'react';
import styled from 'styled-components';

import { prismicPageIds } from '@weco/common/data/hardcoded-ids';
import { pageDescriptions } from '@weco/common/data/microcopy';
import { ApiToolbarLink } from '@weco/common/views/components/ApiToolbar';
import { JsonLdObj } from '@weco/common/views/components/JsonLd';
import Space from '@weco/common/views/components/styled/Space';
import PageLayout from '@weco/common/views/layouts/PageLayout';
import { Page } from '@weco/content/types/pages';
import { BodySliceContexts } from '@weco/content/views/components/Body';

import ThematicBrowsingHeader from './ThematicBrowsing.Header';

const Wrapper = styled(Space).attrs({
  $v: { size: 'md', properties: ['padding-top'] },
})`
  ${props => props.theme.makeSpacePropertyValues('xl', ['padding-bottom'])};
`;

export type ThematicBrowsingCategories =
  | 'people-and-organisations'
  | 'types-and-techniques'
  | 'subjects'
  | 'places';

export type ThematicBrowsingCategoryPageProps = {
  thematicBrowsingPage: Page;
  jsonLd: JsonLdObj;
  bodySliceContexts?: BodySliceContexts;
};

type ThematicBrowsingLayoutProps = PropsWithChildren<{
  page: Page;
  currentCategory: ThematicBrowsingCategories;
  jsonLd: JsonLdObj;
  subPageUid?: string;
  extraBreadcrumbs?: { url: string; text: string }[];
  apiToolbarLinks?: ApiToolbarLink[]; // TODO add links when we have them
}>;

const ThematicBrowsingLayout: FunctionComponent<
  ThematicBrowsingLayoutProps
> = ({
  children,
  page,
  jsonLd,
  currentCategory,
  subPageUid,
  extraBreadcrumbs,
  apiToolbarLinks = [],
}) => {
  const urlPathname = `/${prismicPageIds.collections}/${currentCategory}${subPageUid ? `/${subPageUid}` : ''}`;

  return (
    <PageLayout
      openGraphType={'website' as const}
      jsonLd={jsonLd}
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
      headerProps={{ hasColorBackground: true }}
      clipOverflowX
    >
      <ThematicBrowsingHeader
        title={page.title}
        introText={page.introText}
        extraBreadcrumbs={extraBreadcrumbs}
        currentCategory={currentCategory}
      />
      <Wrapper>{children}</Wrapper>
    </PageLayout>
  );
};

export default ThematicBrowsingLayout;
