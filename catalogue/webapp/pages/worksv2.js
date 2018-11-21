// @flow
// $FlowFixMe: using react aloha for hooks, which isn't in the typedefs
import {Fragment, useState, useEffect, useRef} from 'react';
import Router from 'next/router';
import {font, grid, spacing, classNames} from '@weco/common/utils/classnames';
import PageDescription from '@weco/common/views/components/PageDescription/PageDescription';
import PageWrapper from '@weco/common/views/components/PageWrapper/PageWrapper';
import InfoBanner from '@weco/common/views/components/InfoBanner/InfoBanner2';
import Icon from '@weco/common/views/components/Icon/Icon';
import SearchBox from '@weco/common/views/components/SearchBox/SearchBox';
import StaticWorksContent from '@weco/common/views/components/StaticWorksContent/StaticWorksContent';
import WorkPromo from '@weco/common/views/components/WorkPromo/WorkPromo';
import Paginator from '@weco/common/views/components/Paginator/Paginator';
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
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    document.title = `${query} | Catalogue search | Wellcome Collection`;
  }, [query]);

  // 1. We use this as we get the `initalWorks` from `getInitialProps`
  //    Whereas standard React apps would fetch on first render
  //    See: https://reactjs.org/docs/hooks-faq.html#is-there-something-like-instance-variables
  const firstRender = useRef(true);
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }

    setLoading(true);
    Router.push(
      worksV2Link({ query, page }).href,
      worksV2Link({ query, page }).as,
      { shallow: true }
    );
    // TODO: Look into memoiszing results so we don't hit the API again
    //       See: https://reactjs.org/docs/hooks-reference.html#usememo

    // TODO: Return a cleanup funciton here to stop the network request.
    getWorks({query, page, filters}).then(setWorks).then(() => setLoading(false));
  }, [page, query]);

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
                  const newQuery = form.elements.query.value;
                  setQuery(newQuery);
                  setPage(1);
                }} />
              {!works
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

      {works && works.results.length > 0 &&
        <Fragment>
          <div className={`row ${spacing({s: 3, m: 5}, {padding: ['top']})}`}>
            <div className='container'>
              <div className='grid'>
                <div className='grid__cell'>
                  <div className='flex flex--h-space-between flex--v-center'>
                    <Fragment>
                      <Paginator
                        currentPage={page}
                        pageSize={works.pageSize}
                        totalResults={works.totalResults}
                        link={worksV2Link({query, page})}
                        onPageChange={async (event, newPage) => {
                          event.preventDefault();
                          setPage(newPage);
                        }}
                      />
                    </Fragment>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div
            className={`row ${spacing({s: 4}, {padding: ['top']})}`}
            style={{ opacity: loading ? 0 : 1 }}>
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

          <div className={`row ${spacing({s: 10}, {padding: ['top', 'bottom']})}`}>
            <div className='container'>
              <div className='grid'>
                <div className='grid__cell'>
                  <div className='flex flex--h-space-between flex--v-center'>
                    <Fragment>
                      <Paginator
                        currentPage={page}
                        pageSize={works.pageSize}
                        totalResults={works.totalResults}
                        link={worksV2Link({query, page})}
                        onPageChange={async (event, newPage) => {
                          event.preventDefault();
                          setPage(newPage);
                        }}
                      />
                    </Fragment>
                  </div>
                </div>
              </div>
            </div>
          </div>
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
