// @flow
import {Fragment, Component} from 'react';
import Router from 'next/router';
import NextLink from 'next/link';
import {font, grid, spacing, classNames} from '@weco/common/utils/classnames';
import {default as PageWrapper, pageStore} from '@weco/common/views/components/PageWrapper/PageWrapper';
import InfoBanner from '@weco/common/views/components/InfoBanner/InfoBanner';
import Icon from '@weco/common/views/components/Icon/Icon';
import SearchBox from '@weco/common/views/components/SearchBox/SearchBox';
import StaticWorksContent from '@weco/common/views/components/StaticWorksContent/StaticWorksContent';
import WorkPromo from '@weco/common/views/components/WorkPromo/WorkPromo';
import Pagination, {PaginationFactory} from '@weco/common/views/components/Pagination/Pagination';
import type {Props as PaginationProps} from '@weco/common/views/components/Pagination/Pagination';
import type {GetInitialPropsProps} from '@weco/common/views/components/PageWrapper/PageWrapper';
import {getWorks} from '../services/catalogue/works';
import {workLink, worksLink} from '../services/catalogue/links';

// TODO: Setting the event parameter to type 'Event' leads to
// an 'Indexable signature not found in EventTarget' Flow
// error. We're setting the properties we expect here until
// we find a better solution.
type PageProps = {|
  query: ?string,
  page: ?number,
  works: {| results: [], totalResults: number |},
  pagination: ?PaginationProps,
  version: ?number
|}

type ComponentProps = {|
  ...PageProps,
  handleSubmit: (SyntheticEvent<HTMLFormElement>) => void
|}

export const Works = ({
  query,
  page,
  works,
  pagination,
  handleSubmit,
  version
}: ComponentProps) => (
  <Fragment>
    <InfoBanner text={`Coming from Wellcome Images? All freely available images have now been moved to the Wellcome Collection website. Here we're working to improve data quality, search relevance and tools to help you use these images more easily`} cookieName='WC_wellcomeImagesRedirect' />

    <div className={classNames([
      'row bg-cream',
      spacing({s: 3, m: 5}, {padding: ['top']}),
      spacing({s: 3, m: 4, l: 6}, {padding: ['bottom']})
    ])}>
      <div className='container'>
        <div className='grid'>
          <div className={grid({s: 12, m: 12, l: 12, xl: 12})}>
            <div className={classNames([
              'flex flex--h-space-between flex--v-center flex--wrap',
              spacing({s: 2}, {margin: ['bottom']})
            ])}>
              <h1 className={classNames([
                font({s: 'WB6', m: 'WB4'}),
                spacing({s: 2}, {margin: ['bottom']}),
                spacing({s: 4}, {margin: ['right']}),
                spacing({s: 0}, {margin: ['top']})
              ])}>Search our images</h1>
              <div className='plain-text flex flex--v-center'>
                <Icon name='underConstruction' extraClasses='margin-right-s2' />
                <p className='no-margin'>We’re improving how search works. <a href='/works/progress'>Find out more</a>.</p>
              </div>
            </div>
          </div>
        </div>
        <div className='grid'>
          <div className={grid({s: 12, m: 10, l: 8, xl: 8})}>
            <SearchBox
              action=''
              id='search-works'
              name='query'
              query={query || ''}
              autofocus={true}
              onSubmit={handleSubmit} />

            {!query
              ? <p className={classNames([
                spacing({s: 4}, {margin: ['top']}),
                font({s: 'HNL4', m: 'HNL3'})
              ])}>Find thousands of Creative Commons licensed images from historical library materials and museum objects to contemporary digital photographs.</p>
              : <p className={classNames([
                spacing({s: 2}, {margin: ['top', 'bottom']}),
                font({s: 'LR3', m: 'LR2'})
              ])}>{works.totalResults !== 0 ? works.totalResults : 'No'} results for &apos;{query}&apos;
              </p>
            }
          </div>
        </div>
      </div>
    </div>

    {!query &&
      <StaticWorksContent />
    }

    {query &&
      <Fragment>
        {pagination && pagination.range &&
          <div className={`row ${spacing({s: 3, m: 5}, {padding: ['top']})}`}>
            <div className='container'>
              <div className='grid'>
                <div className='grid__cell'>
                  <div className='flex flex--h-space-between flex--v-center'>

                    <Fragment>
                      <div className={`flex flex--v-center font-pewter ${font({s: 'LR3', m: 'LR2'})}`}>
                          Showing {pagination.range.beginning} - {pagination.range.end}
                      </div>
                      <Pagination
                        total={pagination.total}
                        prevPage={pagination.prevPage}
                        currentPage={pagination.currentPage}
                        pageCount={pagination.pageCount}
                        nextPage={pagination.nextPage}
                        nextQueryString={pagination.nextQueryString}
                        prevQueryString={pagination.prevQueryString} />
                    </Fragment>
                  </div>
                </div>
              </div>
            </div>
          </div>
        }
        {version === 2 &&
          <div className='container'>
            <div className='grid'>
              <div className={grid({s: 12})}>
                {works.results.map(result => (
                  <NextLink href={`/work?id=${result.id}`} as={`/works/${result.id}`} key={result.id}>
                    <a>
                      <h2>{result.title}</h2>
                    </a>
                  </NextLink>
                ))}
              </div>
            </div>
          </div>
        }
        {version !== 2 &&
          <div className={`row ${spacing({s: 4}, {padding: ['top']})}`}>
            <div className='container'>
              <div className='grid'>
                {works.results.map(result => (
                  <div key={result.id} className={grid({s: 6, m: 4, l: 3, xl: 2})}>
                    <WorkPromo
                      id={result.id}
                      image={{
                        contentUrl: result.thumbnail ? result.thumbnail.url : 'https://via.placeholder.com/1600x900?text=%20',
                        width: 300,
                        height: 300,
                        alt: ''
                      }}
                      datePublished={result.createdDate && result.createdDate.label}
                      title={result.title}
                      link={workLink({ id: result.id, query, page })} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        }
        {pagination && pagination.range &&
          <div className={`row ${spacing({s: 10}, {padding: ['top', 'bottom']})}`}>
            <div className='container'>
              <div className='grid'>
                <div className='grid__cell'>
                  <div className='flex flex--h-space-between flex--v-center'>

                    <Fragment>
                      <div className={`flex flex--v-center font-pewter ${font({s: 'LR3', m: 'LR2'})}`}>
                        Showing {pagination.range.beginning} - {pagination.range.end}
                      </div>
                      <Pagination
                        total={pagination.total}
                        prevPage={pagination.prevPage}
                        currentPage={pagination.currentPage}
                        pageCount={pagination.pageCount}
                        nextPage={pagination.nextPage}
                        nextQueryString={pagination.nextQueryString}
                        prevQueryString={pagination.prevQueryString} />
                    </Fragment>
                  </div>
                </div>
              </div>
            </div>
          </div>
        }
      </Fragment>
    }
  </Fragment>
);

export class WorksPage extends Component<PageProps> {
  static getInitialProps = async (context: GetInitialPropsProps) => {
    const version = pageStore('toggles').apiV2 ? 2 : 1;
    const query = context.query.query;
    const page = context.query.page ? parseInt(context.query.page, 10) : 1;
    const works = await getWorks({ query, page, version });

    if (works.type === 'Error') {
      return { statusCode: works.httpStatus };
    }

    const pagination = PaginationFactory.fromList(
      works.results,
      Number(works.totalResults) || 1,
      Number(page) || 1,
      works.pageSize || 1,
      {query: query || ''}
    );

    return {
      works,
      query,
      page,
      pagination: pagination,
      title: `Image catalogue search${query ? `: ${query}` : ''}`,
      description: 'Search through the Wellcome Collection image catalogue',
      analyticsCategory: 'collections',
      siteSection: 'images',
      canonicalUrl: `https://wellcomecollection.org/works${query && `?query=${query}`}`,
      version
    };
  };

  handleSubmit = (event: SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();
    // $FlowFixMe: Find out how to access specific `elements` on ``HTMLFormElement`
    const queryString = event.currentTarget.elements.query.value;

    // Update the URL, which in turn will update props
    // $FlowFixMe
    Router.push(worksLink({ query: queryString, page: 1 }).href);
  }

  render() {
    return (
      <Works
        version={this.props.version}
        page={this.props.page}
        query={this.props.query}
        works={this.props.works}
        pagination={this.props.pagination}
        handleSubmit={this.handleSubmit}
      />
    );
  }
}

export default PageWrapper(WorksPage);
