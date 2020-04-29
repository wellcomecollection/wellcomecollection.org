// @flow
import type { Context } from 'next';
import { Component } from 'react';
import styled from 'styled-components';
import { classNames, font } from '@weco/common/utils/classnames';
import { getArticles } from '@weco/common/services/prismic/articles';
import { articleLd } from '@weco/common/utils/json-ld';
import { getPage } from '@weco/common/services/prismic/pages';
import CardGrid from '@weco/common/views/components/CardGrid/CardGrid';
import SectionHeader from '@weco/common/views/components/SectionHeader/SectionHeader';
import SpacingSection from '@weco/common/views/components/SpacingSection/SpacingSection';
import SpacingComponent from '@weco/common/views/components/SpacingComponent/SpacingComponent';
import PageLayout from '@weco/common/views/components/PageLayout/PageLayout';
import { type Article } from '@weco/common/model/articles';
import type { Page as PageType } from '@weco/common/model/pages';
import { type PaginatedResults } from '@weco/common/services/prismic/types';
import Space from '@weco/common/views/components/styled/Space';
import Layout10 from '@weco/common/views/components/Layout10/Layout10';
import SimpleCardGrid from '@weco/common/views/components/SimpleCardGrid/SimpleCardGrid';
import PageHeaderStandfirst from '@weco/common/views/components/PageHeaderStandfirst/PageHeaderStandfirst';

const PageHeading = styled(Space).attrs({
  as: 'h1',
  v: {
    size: 'l',
    properties: ['margin-top', 'margin-bottom'],
  },
  className: classNames({
    'no-margin': true,
    [font('wb', 1)]: true,
  }),
})`
  max-width: 780px;
`;

const CreamBox = styled(Space).attrs({
  h: { size: 'l', properties: ['padding-left', 'padding-right'] },
  v: { size: 'l', properties: ['padding-top', 'padding-bottom'] },
})`
  background: ${props => props.theme.colors.cream};
`;

type Props = {|
  articles: PaginatedResults<Article>,
  page: PageType,
|};

const pageDescription =
  'Visit our free museum and library in central London connecting science, medicine, life and art. Explore our exhibitions, live events, gallery tours, restaurant, cafe, bookshop, and cafe. Fully accessible. Open late on Thursday evenings.';
const pageImage =
  'https://images.prismic.io/wellcomecollection/fc1e68b0528abbab8429d95afb5cfa4c74d40d52_tf_180516_2060224.jpg?auto=compress,format&w=800';
export class HomePage extends Component<Props> {
  static getInitialProps = async (ctx: Context) => {
    const { id } = ctx.query;
    const articlesPromise = getArticles(ctx.req, { pageSize: 4 }); // TODO make client side?
    const pagePromise = await getPage(ctx.req, id);
    const [articles, page] = await Promise.all([articlesPromise, pagePromise]);
    if (articles && page) {
      return {
        articles,
        page,
      };
    } else {
      return { statusCode: 404 };
    }
  };

  render() {
    const articles = this.props.articles;
    const page = this.props.page;
    const standFirst = page.body.find(slice => slice.type === 'standfirst');
    const contentList = page.body.find(slice => slice.type === 'contentList');

    return (
      <PageLayout
        title={''}
        description={pageDescription}
        url={'/'}
        jsonLd={[...articles.results.map(articleLd)]}
        openGraphType={'website'}
        siteSection={null}
        imageUrl={pageImage}
        imageAltText={''}
      >
        <Layout10>
          <SpacingSection>
            <PageHeading>
              The free museum and library for the incurably curious
            </PageHeading>
            {standFirst && (
              <CreamBox>
                <PageHeaderStandfirst html={standFirst.value} />
              </CreamBox>
            )}
          </SpacingSection>
        </Layout10>
        {contentList && (
          <SpacingSection>
            <SpacingComponent>
              <SectionHeader title={contentList.value.title} />
            </SpacingComponent>
            <SpacingComponent>
              <SimpleCardGrid items={contentList.value.items} />
            </SpacingComponent>
          </SpacingSection>
        )}
        <SpacingSection>
          <SpacingComponent>
            <SectionHeader title="Latest stories" />
          </SpacingComponent>
          <SpacingComponent>
            <CardGrid
              items={articles.results}
              itemsPerRow={4}
              itemsHaveTransparentBackground={true}
              links={[{ text: 'All stories', url: '/stories' }]}
            />
          </SpacingComponent>
        </SpacingSection>
      </PageLayout>
    );
  }
}

export default HomePage;
