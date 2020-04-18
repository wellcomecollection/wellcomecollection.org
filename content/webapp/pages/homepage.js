// @flow
import type { Context } from 'next';
import { Component } from 'react';
import { classNames, font, cssGrid } from '@weco/common/utils/classnames';
import { getArticles } from '@weco/common/services/prismic/articles';
import { articleLd } from '@weco/common/utils/json-ld';
import CardGrid from '@weco/common/views/components/CardGrid/CardGrid';
import SectionHeader from '@weco/common/views/components/SectionHeader/SectionHeader';
import SpacingSection from '@weco/common/views/components/SpacingSection/SpacingSection';
import SpacingComponent from '@weco/common/views/components/SpacingComponent/SpacingComponent';
import PageLayout from '@weco/common/views/components/PageLayout/PageLayout';
import { type Article } from '@weco/common/model/articles';
import type { Page as PageType } from '@weco/common/model/pages';
import { type PaginatedResults } from '@weco/common/services/prismic/types';
import Space from '@weco/common/views/components/styled/Space';
import { getPage } from '@weco/common/services/prismic/pages';
import HomepageCardGrid from '@weco/common/views/components/HomepageCardGrid/HomepageCardGrid';

import PageHeaderStandfirst from '@weco/common/views/components/PageHeaderStandfirst/PageHeaderStandfirst';

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
    const articles = await getArticles(ctx.req, { pageSize: 4 }); // TODO make client side?
    const page = await getPage(ctx.req, id);
    if (articles || page) {
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
        <SpacingSection>
          <div className="css-grid__container">
            <div className="css-grid">
              <div
                className={classNames({
                  [cssGrid({ s: 12, m: 12, l: 10, xl: 9 })]: true,
                })}
              >
                <Space
                  v={{
                    size: 'm',
                    properties: ['margin-top'],
                  }}
                  as="h1"
                  className={classNames({
                    'no-margin': true,
                    [font('wb', 1)]: true,
                  })}
                >
                  The free museum and library for the incurably curious
                  <div style={{ background: 'grey' }}>
                    <Space
                      v={{
                        size: 'm',
                        properties: ['margin-top'],
                      }}
                      as="div"
                      className={classNames({
                        'no-margin': true,
                        [font('hnl', 4)]: true,
                      })}
                    >
                      {standFirst && (
                        <PageHeaderStandfirst html={standFirst.value} />
                      )}
                    </Space>
                  </div>
                </Space>
              </div>
            </div>
          </div>
        </SpacingSection>
        {contentList && (
          <SpacingSection>
            <SpacingComponent>
              <SectionHeader title={contentList.value.title} />
            </SpacingComponent>
            <SpacingComponent>
              <HomepageCardGrid items={contentList.value.items} />
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
