// @flow
// $FlowFixMe: using react aloha for hooks, which isn't in the typedefs
import {Fragment, useState, useEffect} from 'react';
import Router from 'next/router';
import {font, grid, spacing, classNames} from '@weco/common/utils/classnames';
import PageWrapper from '@weco/common/views/components/PageWrapper/PageWrapper';
import InfoBanner from '@weco/common/views/components/InfoBanner/InfoBanner2';
import Icon from '@weco/common/views/components/Icon/Icon';
import SearchBox from '@weco/common/views/components/SearchBox/SearchBox';
import StaticWorksContent from '@weco/common/views/components/StaticWorksContent/StaticWorksContent';
import WorkPromo from '@weco/common/views/components/WorkPromo/WorkPromo';
import Pagination, {PaginationFactory} from '@weco/common/views/components/Pagination/Pagination';
import type {
  GetInitialPropsProps,
  ExtraProps
} from '@weco/common/views/components/PageWrapper/PageWrapper';
import {getWorks} from '../services/catalogue/worksv2';
import {workV2Link, worksV2Link} from '../services/catalogue/links';

type Props = {|
  initialQuery: ?string,
  initialWorks: ?{| results: [], totalResults: number |},
  initialPage: ?number,
  filters: Object
|}

export const Works = ({
  initialQuery,
  initialWorks,
  filters,
  initialPage
}: Props) => {
  const [query, setQuery] = useState(initialQuery);
  const [works, setWorks] = useState(initialWorks);
  const [page, setPage] = useState(initialPage);
  const pagination = works ? PaginationFactory.fromList(
    works.results,
    Number(works.totalResults) || 1,
    Number(page) || 1,
    works.pageSize || 1,
    {query: query || ''}
  ) : null;

  // https://reactjs.org/docs/hooks-faq.html#how-do-i-implement-getderivedstatefromprops
  // Make sure if we're using the Pagination element, which reinitialised the
  // `getInitialProps` we set the works to the `initialWorks` from that function
  if (page !== initialPage && query === initialQuery) {
    setPage(initialPage);
    setWorks(initialWorks);
  }

  useEffect(() => {
    // Update the document title using the browser API
    document.title = `${query} | Catalogue search | Wellcome Collection`;
  });

  return (
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
                onSubmit={async (event) => {
                  event.preventDefault();
                  const form = event.currentTarget;
                  // $FlowFixMe
                  const value = form.elements.query.value;
                  const page = 1;
                  const newWorks = value ? await getWorks({ query: value, page, filters }) : null;
                  setWorks(newWorks);
                  setQuery(value);
                  setPage(1);

                  Router.push(
                    worksV2Link({ query: value, page: undefined }).href,
                    worksV2Link({ query: value, page: undefined }).as,
                    { shallow: true }
                  );
                }} />
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
                      link={workV2Link({ id: result.id, query, page })} />
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
};

Works.getInitialProps = async (
  context: GetInitialPropsProps,
  { toggles = {} }: ExtraProps
) => {
  const query = context.query.query;
  const page = context.query.page ? parseInt(context.query.page, 10) : 1;
  const filters = toggles.unfilteredCatalogueResults ? {} : {
    workType: ['q', 'k'],
    'items.locations.locationType': ['iiif-image']
  };
  const works = query ? await getWorks({ query, page, filters }) : null;

  if (works && works.type === 'Error') {
    return { statusCode: works.httpStatus };
  }

  return {
    initialPage: page,
    initialWorks: works,
    initialQuery: query,
    filters,
    title: `${query} | Catalogue search | Wellcome Collection`,
    description: 'Search through the Wellcome Collection image catalogue',
    analyticsCategory: 'collections',
    siteSection: 'images',
    canonicalUrl: `https://wellcomecollection.org/works${query && `?query=${query}`}`
  };
};

export default PageWrapper(Works);
