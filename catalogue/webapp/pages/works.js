// @flow
import {Fragment, Component} from 'react';
import Router from 'next/router';
import fetch from 'isomorphic-unfetch';
import {font, grid, spacing, classNames} from '@weco/common/utils/classnames';
import PageDescription from '@weco/common/views/components/PageDescription/PageDescription';
import PageWrapper from '@weco/common/views/components/PageWrapper/PageWrapper';
import InfoBanner from '@weco/common/views/components/InfoBanner/InfoBanner';
import Icon from '@weco/common/views/components/Icon/Icon';
import SearchBox from '@weco/common/views/components/SearchBox/SearchBox';
import StaticWorksContent from '@weco/common/views/components/StaticWorksContent/StaticWorksContent';
import WorkPromo from '@weco/common/views/components/WorkPromo/WorkPromo';
import Pagination, {PaginationFactory} from '@weco/common/views/components/Pagination/Pagination';
import type {Props as PaginationProps} from '@weco/common/views/components/Pagination/Pagination';
import type {EventWithInputValue} from '@weco/common/views/components/HTMLInput/HTMLInput';

// TODO: Setting the event parameter to type 'Event' leads to
// an 'Indexable signature not found in EventTarget' Flow
// error. We're setting the properties we expect here until
// we find a better solution.
type Props = {|
  query: ?string,
  page: ?number,
  works: {| results: [], totalResults: number |},
  pagination: PaginationProps,
  handleSubmit: (EventWithInputValue) => void
|}

const WorksComponent = ({
  query,
  page,
  works,
  pagination,
  handleSubmit
}: Props) => (
  <Fragment>
    <PageDescription title='Search our images' extraClasses='page-description--hidden' />
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
              <h2 className={classNames([
                font({s: 'WB6', m: 'WB4'}),
                spacing({s: 2}, {margin: ['bottom']}),
                spacing({s: 4}, {margin: ['right']}),
                spacing({s: 0}, {margin: ['top']})
              ])}>Search our images</h2>
              <div className='plain-text flex flex--v-center'>
                <Icon name='underConstruction' extraClasses='margin-right-s2' />
                <p className='no-margin'>We’re improving how search works. <a href='/progress'>Find out more</a>.</p>
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
              query={decodeURIComponent(query || '')}
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
              ])}>{works.totalResults !== 0 ? works.totalResults : 'No'} results for &apos;{decodeURIComponent(query)}&apos;
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
        <div className={`row ${spacing({s: 4}, {padding: ['top']})}`}>
          <div className='container'>
            <div className='grid'>
              {works.results.map(result => (
                <div key={result.id} className={grid({s: 6, m: 4, l: 3, xl: 2})}>
                  <WorkPromo
                    id={result.id}
                    image={{
                      contentUrl: result.thumbnail && result.thumbnail.url,
                      width: 300,
                      height: 300,
                      alt: ''
                    }}
                    datePublished={result.createdDate && result.createdDate.label}
                    title={result.title}
                    url={`/works/${result.id}${getQueryParamsForWork(query, page)}`} />
                </div>
              ))}
            </div>
          </div>
        </div>
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

class Works extends Component<Props> {
  static getInitialProps = async (context) => {
    const query = context.query.query;
    const page = context.query.page ? parseInt(context.query.page, 10) : 1;
    const works = await getWorks({ query, page });
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
      title: 'Image catalogue search | Wellcome Collection',
      description: 'Search through the Wellcome Collection image catalogue',
      analyticsCategory: 'collections',
      siteSection: 'images'
    };
  };

  handleSubmit = (event: EventWithInputValue) => {
    event.preventDefault();

    const queryString = encodeURIComponent(event.target[0].value);

    // Update the URL, which in turn will update props
    Router.push({
      pathname: '/works',
      query: {query: queryString, page: '1'}
    });
  }

  render() {
    return (
      <WorksComponent
        page={this.props.page}
        query={this.props.query}
        works={this.props.works}
        pagination={this.props.pagination}
        handleSubmit={this.handleSubmit}
      />
    );
  }
}

export default PageWrapper(Works);

type GetWorksProps = {|
  query: ?string,
  page: ?number
|}
async function getWorks({ query, page }: GetWorksProps): Object {
  const res = await fetch(
    `https://api.wellcomecollection.org/catalogue/v1/works?` +
    `includes=identifiers,thumbnail,items&pageSize=100` +
    (query ? `&query=${query}` : '') +
    (page ? `&page=${page}` : '')
  );
  const json = await res.json();

  return json;
}

function getQueryParamsForWork(query: ?string, page: ?number) {
  const params = {query, page};
  return Object.keys({query, page})
    .filter(key => params[key])
    .reduce((acc, key, index) => {
      return `${acc}${index > 0 ? '&' : ''}${key}=${params[key] || ''}`;
    }, '?');
}
