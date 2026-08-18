import * as prismic from '@prismicio/client';
import { ReactNode } from 'react';

import { typography } from '@weco/common/utils/classnames';
import Breadcrumb, {
  getBreadcrumbItems,
} from '@weco/common/views/components/Breadcrumb';
import Layout, {
  gridSize10,
  gridSize8,
} from '@weco/common/views/components/Layout';
import PrismicHtmlBlock from '@weco/common/views/components/PrismicHtmlBlock';
import Space from '@weco/common/views/components/styled/Space';
import HeaderColourBand from '@weco/content/views/components/HeaderColourBand';

export type Props = {
  title: string;
  introText?: string | prismic.RichTextField;
  extraBreadcrumbs?: { url: string; text: string }[];
  navigation?: ReactNode;
  afterIntro?: ReactNode;
};

// The shared header treatment for /collections/* pages: a solid colour
// band with breadcrumb, title and optional intro text. Callers that need
// more (eg thematic browsing's category tabs and Subjects sub-menu) slot
// their own content in via `navigation`/`afterIntro` rather than this
// component knowing about them.
const CollectionsHeader = ({
  title,
  introText,
  extraBreadcrumbs,
  navigation,
  afterIntro,
}: Props) => {
  return (
    <HeaderColourBand
      paddingBottomCss={theme =>
        theme.makeSpacePropertyValues('xl', ['padding-bottom'])
      }
    >
      <Space
        data-component="collections-header"
        $v={{
          size: 'sm',
          properties: ['margin-bottom'],
          overrides: { md: '150' },
        }}
      >
        <Breadcrumb
          items={getBreadcrumbItems('collections', extraBreadcrumbs).items}
        />
      </Space>

      {navigation && (
        <Space $v={{ size: 'md', properties: ['margin-bottom', 'margin-top'] }}>
          {navigation}
        </Space>
      )}

      <Layout gridSizes={gridSize10(false)}>
        <h1 className={typography('heading', 'xxl', 'strong', 'brand')}>
          {title}
        </h1>
      </Layout>

      {introText && (
        <Layout gridSizes={gridSize8(false)}>
          <div className={`${typography('body', 'xl', 'regular')} body-text`}>
            {typeof introText !== 'string' ? (
              <PrismicHtmlBlock html={introText} />
            ) : (
              <p>{introText}</p>
            )}
          </div>
        </Layout>
      )}

      {afterIntro && (
        <Space $v={{ size: 'sm', properties: ['margin-top', 'margin-bottom'] }}>
          {afterIntro}
        </Space>
      )}
    </HeaderColourBand>
  );
};

export default CollectionsHeader;
