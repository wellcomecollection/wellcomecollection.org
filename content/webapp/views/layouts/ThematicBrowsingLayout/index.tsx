import * as prismic from '@prismicio/client';
import { useRouter } from 'next/router';
import {
  ComponentType,
  FunctionComponent,
  PropsWithChildren,
  useEffect,
  useState,
} from 'react';
import styled from 'styled-components';

import { prismicPageIds } from '@weco/common/data/hardcoded-ids';
import { pageDescriptions } from '@weco/common/data/microcopy';
import { SiteSection } from '@weco/common/model/site-section';
import { font } from '@weco/common/utils/classnames';
import { ApiToolbarLink } from '@weco/common/views/components/ApiToolbar';
import Breadcrumb, {
  getBreadcrumbItems,
} from '@weco/common/views/components/Breadcrumb';
import DecorativeEdge from '@weco/common/views/components/DecorativeEdge';
import Layout, {
  gridSize10,
  gridSize8,
} from '@weco/common/views/components/Layout';
import PrismicHtmlBlock from '@weco/common/views/components/PrismicHtmlBlock';
import { Container } from '@weco/common/views/components/styled/Container';
import LL from '@weco/common/views/components/styled/LL';
import Space from '@weco/common/views/components/styled/Space';
import PageLayout from '@weco/common/views/layouts/PageLayout';

import ThematicBrowsingNavigation, {
  isValidThematicBrowsingCategory,
  ThematicBrowsingCategories,
} from './ThematicBrowsing.Navigation';

const ThematicBrowsingHeaderContainer = styled(Space).attrs({
  $v: { size: 'sm', properties: ['padding-top'] },
})`
  background-color: ${props => props.theme.color('accent.lightGreen')};
  padding-bottom: ${props => props.theme.gutter.xlarge};
`;

const Title = styled(Space).attrs({
  as: 'h1',
  className: font('brand', 4),
  $v: { size: '2xs', properties: ['margin-bottom'] },
})``;

const ThemeDescription = styled.div.attrs({
  className: `${font('sans', 1)} body-text`,
})``;

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

const ThematicBrowsingHeader = ({
  uiTitle,
  currentCategory,
  uiDescription,
  extraBreadcrumbs,
}: {
  uiTitle: string;
  currentCategory: ThematicBrowsingCategories;
  uiDescription?: string | prismic.RichTextField;
  extraBreadcrumbs?: { url: string; text: string }[];
}) => {
  return (
    <>
      <ThematicBrowsingHeaderContainer>
        <Container>
          <Space
            $v={{
              size: 'sm',
              properties: ['margin-top', 'margin-bottom'],
              overrides: { md: '150' },
            }}
          >
            <Breadcrumb
              items={getBreadcrumbItems('collections', extraBreadcrumbs).items}
            />
          </Space>

          <Space
            $v={{ size: 'md', properties: ['margin-bottom', 'margin-top'] }}
          >
            <ThematicBrowsingNavigation currentCategory={currentCategory} />
          </Space>

          <Layout gridSizes={gridSize10(false)}>
            <Title>{uiTitle}</Title>
          </Layout>

          {uiDescription && (
            <Layout gridSizes={gridSize8(false)}>
              <ThemeDescription>
                {typeof uiDescription !== 'string' ? (
                  <PrismicHtmlBlock html={uiDescription} />
                ) : (
                  <p>{uiDescription}</p>
                )}
              </ThemeDescription>
            </Layout>
          )}
        </Container>
      </ThematicBrowsingHeaderContainer>

      <DecorativeEdge variant="wobbly" backgroundColor="white" />
    </>
  );
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

  // TODO is this good? Do we hate this? We needs it.
  if (isLoading) return <LL />;

  return (
    <PageLayout {...pageLayoutMetadata}>
      <ThematicBrowsingHeader
        uiTitle={pageLayoutMetadata.title}
        currentCategory={currentCategory}
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
      <ThematicBrowsingLayout apiToolbarLinks={[]}>
        <WrappedComponent {...props} />
      </ThematicBrowsingLayout>
    );
  };
}

export default ThematicBrowsingLayout;
export { ThematicBrowsingHeader, withThematicBrowsingLayout };
