import { useRouter } from 'next/router';
import {
  ComponentType,
  FunctionComponent,
  PropsWithChildren,
  useEffect,
  useState,
} from 'react';

import { prismicPageIds } from '@weco/common/data/hardcoded-ids';
import { pageDescriptions } from '@weco/common/data/microcopy';
import { SiteSection } from '@weco/common/model/site-section';
import { ApiToolbarLink } from '@weco/common/views/components/ApiToolbar';
import LL from '@weco/common/views/components/styled/LL';
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

type PageLayoutMetadata = {
  openGraphType: 'website';
  jsonLd: { '@type': 'WebPage' };
  hideNewsletterPromo: true;
  excludeRoleMain: true;
  title: string;
  description: string;
  url: {
    pathname: string;
    query: Record<string, string | string[] | undefined>;
  };
  siteSection?: SiteSection;
};

type ThematicBrowsingLayoutProps = PropsWithChildren<{
  apiToolbarLinks: ApiToolbarLink[]; // TODO add links when we have them
}>;

const ThematicBrowsingLayout: FunctionComponent<
  ThematicBrowsingLayoutProps
> = ({ children }) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  const currentCategory = router.pathname.slice(
    router.pathname.lastIndexOf('/') + 1
  );

  const basePageMetadata: PageLayoutMetadata = {
    openGraphType: 'website',
    jsonLd: { '@type': 'WebPage' },
    hideNewsletterPromo: true,
    excludeRoleMain: true,
    siteSection: 'collections' as const,
    title: 'Thematic browsing',
    description: '', // TODO
    url: {
      pathname: router.pathname,
      query: router.query,
    },
  };

  const [pageLayoutMetadata, setPageLayoutMetadata] =
    useState<PageLayoutMetadata>(basePageMetadata);

  useEffect(() => {
    setIsLoading(true);

    switch (currentCategory) {
      case 'people-and-organisations':
        setPageLayoutMetadata({
          ...basePageMetadata,
          description: pageDescriptions.collections.peopleAndOrganisations,
          title: 'People and organisations', //TODO
          url: {
            ...basePageMetadata.url,
            pathname: `/${prismicPageIds.collections}/people-and-organisations`,
          },
        });
        break;
      case 'places':
        setPageLayoutMetadata({
          ...basePageMetadata,
          description: pageDescriptions.collections.places,
          title: 'Places', //TODO
          url: {
            ...basePageMetadata.url,
            pathname: `/${prismicPageIds.collections}/places`,
          },
        });
        break;
      case 'types-and-techniques':
        setPageLayoutMetadata({
          ...basePageMetadata,
          description: pageDescriptions.collections.typesAndTechniques,
          title: 'Types and techniques', //TODO
          url: {
            ...basePageMetadata.url,
            pathname: `/${prismicPageIds.collections}/types-and-techniques`,
          },
        });
        break;
      case 'subjects':
        setPageLayoutMetadata({
          ...basePageMetadata,
          description: pageDescriptions.collections.subjects,
          title: 'Subjects', //TODO
          url: {
            ...basePageMetadata.url,
            pathname: `/${prismicPageIds.collections}/subjects`,
          },
        });
        break;

      default:
        break;
    }
    setIsLoading(false);
  }, [currentCategory]);

  if (!isValidThematicBrowsingCategory(currentCategory)) return null;

  return (
    <PageLayout {...pageLayoutMetadata}>
      {/* TODO is this good? Do we hate this? We needs it. Or maybe not. We have to fix it. */}
      {isLoading ? (
        <LL />
      ) : (
        <ThematicBrowsingHeader
          uiTitle={pageLayoutMetadata.title}
          currentCategory={currentCategory}
        />
      )}
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
      <ThematicBrowsingLayout apiToolbarLinks={[]}>
        <WrappedComponent {...props} />
      </ThematicBrowsingLayout>
    );
  };
}

export default ThematicBrowsingLayout;
export { ThematicBrowsingHeader, withThematicBrowsingLayout };
