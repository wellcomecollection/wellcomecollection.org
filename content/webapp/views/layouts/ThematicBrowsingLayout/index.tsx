import { useRouter } from 'next/router';
import {
  ComponentProps,
  ComponentType,
  FunctionComponent,
  PropsWithChildren,
} from 'react';

import { prismicPageIds } from '@weco/common/data/hardcoded-ids';
import { pageDescriptions } from '@weco/common/data/microcopy';
import { ImageType } from '@weco/common/model/image';
import { ApiToolbarLink } from '@weco/common/views/components/ApiToolbar';
import PageLayout from '@weco/common/views/layouts/PageLayout';

import ThematicBrowsingHeader from './ThematicBrowsing.Header';

const categories = [
  'people-and-organisations',
  'types-and-techniques',
  'subjects',
  'places',
] as const;
export type ThematicBrowsingCategories = (typeof categories)[number];

function isValidThematicBrowsingCategory(
  type?: string
): type is ThematicBrowsingCategories {
  return categories.includes(type as ThematicBrowsingCategories);
}

export type CollectionsStaticPageMeta = {
  urlPathname?: string;
};
export type CollectionsPrismicPageMeta = CollectionsStaticPageMeta & {
  prismicId: string;
  image?: ImageType;
  description?: string;
};

export type ThematicBrowsingLayoutProps = PropsWithChildren<{
  title: string;
  description: string;
  pageMeta: CollectionsPrismicPageMeta | CollectionsStaticPageMeta;
  apiToolbarLinks?: ApiToolbarLink[]; // TODO add links when we have them
  headerProps?: Partial<
    Omit<ComponentProps<typeof ThematicBrowsingHeader>, 'currentCategory'>
  >;
}>;

const ThematicBrowsingLayout: FunctionComponent<
  ThematicBrowsingLayoutProps
> = ({
  children,
  title,
  description,
  pageMeta,
  apiToolbarLinks = [],
  headerProps,
}) => {
  const router = useRouter();

  const currentCategory = router.pathname
    .split('/')
    .filter(Boolean)
    .find(isValidThematicBrowsingCategory);

  if (!currentCategory) return null;

  return (
    <PageLayout
      openGraphType={'website' as const}
      jsonLd={{ '@type': 'WebPage' }}
      hideNewsletterPromo
      siteSection="collections"
      title={title}
      description={
        'description' in pageMeta && pageMeta.description
          ? pageMeta.description
          : description
            ? description
            : pageDescriptions.collections.index
      }
      url={{
        pathname: `/${prismicPageIds.collections}${pageMeta.urlPathname || ''}`,
      }}
      {...('image' in pageMeta && { image: pageMeta.image })}
      {...(apiToolbarLinks.length > 0 && { apiToolbarLinks })}
    >
      <ThematicBrowsingHeader
        uiTitle={headerProps?.uiTitle ?? title}
        uiDescription={headerProps?.uiDescription}
        currentCategory={currentCategory}
        extraBreadcrumbs={headerProps?.extraBreadcrumbs}
      />
      {children}
    </PageLayout>
  );
};

// Higher-order component to wrap a component with ThematicBrowsingLayout
function withThematicBrowsingLayout<P extends ThematicBrowsingLayoutProps>(
  WrappedComponent: ComponentType<P>
): FunctionComponent<P> {
  return function ThematicBrowsingLayoutHOC(props: P) {
    return (
      <ThematicBrowsingLayout {...props}>
        <WrappedComponent {...props} />
      </ThematicBrowsingLayout>
    );
  };
}

export default ThematicBrowsingLayout;
export { ThematicBrowsingHeader, withThematicBrowsingLayout };
