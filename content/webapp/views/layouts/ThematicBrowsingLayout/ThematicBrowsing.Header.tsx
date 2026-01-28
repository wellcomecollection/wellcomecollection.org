import * as prismic from '@prismicio/client';
import styled from 'styled-components';

import { font } from '@weco/common/utils/classnames';
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
import Space from '@weco/common/views/components/styled/Space';

import { ThematicBrowsingCategories } from '.';
import ThematicBrowsingNavigation from './ThematicBrowsing.Navigation';

const ThematicBrowsingHeaderContainer = styled(Space).attrs({
  $v: { size: 'sm', properties: ['padding-top'] },
})`
  background-color: ${props => props.theme.color('accent.lightGreen')};
  padding-bottom: ${props => props.theme.gutter.xlarge};
`;

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
            <h1 className={font('brand', 4)}>{uiTitle}</h1>
          </Layout>

          {uiDescription && (
            <Layout gridSizes={gridSize8(false)}>
              <div className={`${font('sans', 1)} body-text`}>
                {typeof uiDescription !== 'string' ? (
                  <PrismicHtmlBlock html={uiDescription} />
                ) : (
                  <p>{uiDescription}</p>
                )}
              </div>
            </Layout>
          )}
        </Container>
      </ThematicBrowsingHeaderContainer>

      <DecorativeEdge variant="wobbly" backgroundColor="white" />
    </>
  );
};

export default ThematicBrowsingHeader;
