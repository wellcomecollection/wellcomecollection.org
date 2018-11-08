// @flow
// $FlowFixMe useState is not in the new flowtypes yet
import {Fragment, useState} from 'react';
import Router from 'next/router';
import {font, grid, spacing, classNames} from '@weco/common/utils/classnames';
import PageDescription from '@weco/common/views/components/PageDescription/PageDescription';
import PageWrapper from '@weco/common/views/components/PageWrapper/PageWrapper';
import InfoBanner from '@weco/common/views/components/InfoBanner/InfoBanner2';
import Icon from '@weco/common/views/components/Icon/Icon';
import StaticWorksContent from '@weco/common/views/components/StaticWorksContent/StaticWorksContent';
import WorkPromo from '@weco/common/views/components/WorkPromo/WorkPromo';
import Pagination, {PaginationFactory} from '@weco/common/views/components/Pagination/Pagination';
import {trackEvent} from '@weco/common/utils/ga';
import HTMLInput from '@weco/common/views/components/HTMLInput/HTMLInput';
import type {Props as PaginationProps} from '@weco/common/views/components/Pagination/Pagination';
import type {EventWithInputValue} from '@weco/common/views/components/HTMLInput/HTMLInput';
import type {GetInitialPropsProps} from '@weco/common/views/components/PageWrapper/PageWrapper';
import {getWorks} from '../services/catalogue/worksv2';
import {workV2Link} from '../services/catalogue/links';

// TODO: Setting the event parameter to type 'Event' leads to
// an 'Indexable signature not found in EventTarget' Flow
// error. We're setting the properties we expect here until
// we find a better solution.
type PageProps = {|
  page: ?number,
  initialQuery: ?string,
  initialWorks: {| results: [], totalResults: number |},
  pagination: ?PaginationProps,
  version: ?number
|}

type ComponentProps = {|
  ...PageProps,
  handleSubmit: (EventWithInputValue) => void
|}

// TODO: pagination
export const WorksPage = ({
  initialQuery,
  initialWorks,
  page,
  pagination,
  handleSubmit,
  version
}: ComponentProps) => {
  const [query, setQuery] = useState(initialQuery);
  const [worksResponse, setWorksResponse] = useState(initialWorks);

  return (
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
              <div className='search-box js-search-box'>
                <form action={'/worksv2'} onSubmit={async (event) => {
                  event.preventDefault();
                  const queryValue = event.target.elements.query.value;
                  const href = {
                    pathname: '/worksv2',
                    query: queryValue ? {
                      query: queryValue
                    } : null
                  };
                  const as = href;
                  const newWorksResponse = await getWorks({ query: queryValue, page: 1 });
                  setWorksResponse(newWorksResponse);
                  setQuery(queryValue);
                  Router.push(href, as, { shallow: true });
                }}>
                  <HTMLInput
                    id={'search-works'}
                    type='text'
                    name={'query'}
                    label='search'
                    defaultValue={query}
                    placeholder='Search for artworks, photos and more'
                    autofocus={true}
                    isLabelHidden={true} />
                  <div className='search-box__button-wrap absolute bg-green'>
                    <button className={`search-box__button line-height-1 plain-button no-padding ${font({s: 'HNL3', m: 'HNL2'})}`}>
                      <span className='visually-hidden'>Search</span>
                      <span className='flex flex--v-center flex--h-center'>
                        <Icon name='search' title='Search' extraClasses='icon--white' />
                      </span>
                    </button>
                  </div>
                </form>
                <button className='search-box__clear absolute line-height-1 plain-button v-center no-padding js-clear'
                  onClick={() => trackEvent({
                    category: 'component',
                    action: `clear-search:click`,
                    label: `input-id:search-works`
                  })}
                  type='button'>
                  <Icon name='clear' title='Clear' />
                </button>
              </div>

              {!worksResponse
                ? <p className={classNames([
                  spacing({s: 4}, {margin: ['top']}),
                  font({s: 'HNL4', m: 'HNL3'})
                ])}>Find thousands of Creative Commons licensed images from historical library materials and museum objects to contemporary digital photographs.</p>
                : <p className={classNames([
                  spacing({s: 2}, {margin: ['top', 'bottom']}),
                  font({s: 'LR3', m: 'LR2'})
                ])}>{worksResponse.totalResults !== 0 ? worksResponse.totalResults : 'No'} results for &apos;{query}&apos;
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

          {worksResponse && worksResponse.results.length > 0 &&
            <div className={`row ${spacing({s: 4}, {padding: ['top']})}`}>
              <div className='container'>
                <div className='grid'>
                  {worksResponse.results.map(result => (
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
                        link={workV2Link({ id: result.id, query, page: page !== 1 ? page : undefined })} />
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

WorksPage.getInitialProps = async (context: GetInitialPropsProps) => {
  const query = context.query.query;
  const page = context.query.page ? parseInt(context.query.page, 10) : 1;
  const works = query ? await getWorks({ query, page }) : null;

  if (works && works.type === 'Error') {
    return { statusCode: works.httpStatus };
  }

  const pagination = works && PaginationFactory.fromList(
    works.results,
    Number(works.totalResults) || 1,
    Number(page) || 1,
    works.pageSize || 1,
    {query: query || ''}
  );

  return {
    page,
    initialWorks: works,
    initialQuery: query,
    pagination: pagination,
    title: `Image catalogue search${query ? `: ${query}` : ''}`,
    description: 'Search through the Wellcome Collection image catalogue',
    analyticsCategory: 'collections',
    siteSection: 'images',
    canonicalUrl: `https://wellcomecollection.org/works${query && `?query=${query}`}`
  };
};

export default PageWrapper(WorksPage);
