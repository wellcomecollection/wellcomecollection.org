// @flow
import type {Context} from 'next';
import type {CatalogueApiError, CatalogueResultsList} from '../services/catalogue/works';
// $FlowFixMe: using react aloha for hooks, which isn't in the typedefs
import {Fragment, useState, useEffect, useRef} from 'react';
import Router from 'next/router';
import NextLink from 'next/link';
import {font, grid, spacing, classNames} from '@weco/common/utils/classnames';
import PageLayout from '@weco/common/views/components/PageLayout/PageLayout';
import InfoBanner from '@weco/common/views/components/InfoBanner/InfoBanner';
import Icon from '@weco/common/views/components/Icon/Icon';
import SearchBox from '@weco/common/views/components/SearchBox/SearchBox';
import StaticWorksContent from '@weco/common/views/components/StaticWorksContent/StaticWorksContent';
import WorkPromo from '@weco/common/views/components/WorkPromo/WorkPromo';
import Paginator from '@weco/common/views/components/Paginator/Paginator';
import ErrorPage from '@weco/common/views/components/ErrorPage/ErrorPage';
import LinkLabels from '@weco/common/views/components/LinkLabels/LinkLabels';
import {getWorks} from '../services/catalogue/works';
import {workLink, worksLink} from '../services/catalogue/links';

type Props = {|
  initialQuery: ?string,
  initialWorks: ?CatalogueResultsList | CatalogueApiError,
  initialPage: ?number,
  initialFilters: Object,
  showCatalogueSearchFilters: boolean
|}

const workTypes = [
  { id: 'a', label: 'Books' },
  { id: 'b', label: 'Manuscripts, Asian' },
  { id: 'c', label: 'Music' },
  { id: 'd', label: 'Journals' },
  { id: 'e', label: 'Maps' },
  { id: 'f', label: 'E-videos' },
  { id: 'g', label: 'Videorecordings' },
  { id: 'h', label: 'Archives and manuscripts' },
  { id: 'i', label: 'Sound' },
  { id: 'j', label: 'E-journals' },
  { id: 'k', label: 'Pictures' },
  { id: 'l', label: 'Ephemera' },
  { id: 'm', label: 'CD-Roms' },
  { id: 'n', label: 'Cinefilm' },
  { id: 'p', label: 'Mixed materials' },
  { id: 'q', label: 'Digital images' },
  { id: 'r', label: '3-D Objects' },
  { id: 's', label: 'E-sound' },
  { id: 'u', label: 'Standing order' },
  { id: 'v', label: 'E-books' },
  { id: 'w', label: 'Student dissertations' },
  { id: 'x', label: 'E-manuscripts, Asian' },
  { id: 'z', label: 'Web sites ' }
];

export const Works = ({
  initialQuery,
  initialWorks,
  initialPage,
  initialFilters,
  showCatalogueSearchFilters
}: Props) => {
  if (initialWorks && initialWorks.type === 'Error') {
    return (
      <PageLayout
        title={initialWorks.httpStatus.toString()}
        description={''}
        url={{pathname: `/works`}}
        openGraphType={'website'}
        jsonLd={{ '@type': 'WebPage' }}
        oEmbedUrl={`https://wellcomecollection.org/works`}
        imageUrl={null}
        imageAltText={null}>
        <ErrorPage
          errorStatus={initialWorks.httpStatus}
        />
      </PageLayout>
    );
  }

  const [query, setQuery] = useState(initialQuery);
  const [works, setWorks] = useState(initialWorks);
  const [page, setPage] = useState(initialPage);
  const [filters, setFilters] = useState(initialFilters);
  const [workType, setWorkType] = useState(initialFilters.workType);
  const [showImagesOnly, setShowImagesOnly] = useState(Boolean(initialFilters['items.locations.locationType']));
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    document.title = `${query} | Catalogue search | Wellcome Collection`;
  }, [query]);

  // On the initial render from next, we dont want to run the router, nor update
  // the works so we just skip this effect for now.
  // See: https://reactjs.org/docs/hooks-faq.html#is-there-something-like-instance-variables
  const initialRender = useRef(true);

  useEffect(() => {
    if (initialRender.current) {
      initialRender.current = false;
      return;
    }
    // TODO: (flowtype) next's typing says that these need to be string, this isn't true,
    // you can use URL like objects too
    Router.push(
      // $FlowFixMe
      worksLink({query, page}).href,
      // $FlowFixMe
      worksLink({query, page}).as,
      { shallow: true }
    ).then(() => window.scrollTo(0, 0));

    if (query && query !== '') {
      setLoading(true);
      // TODO: Look into memoiszing results so we don't hit the API again
      //       See: https://reactjs.org/docs/hooks-reference.html#usememo

      // TODO: Return a cleanup function here to stop the network request.
      getWorks({
        query,
        page,
        filters
      }).then(setWorks).then(() => setLoading(false));
    } else {
      setWorks(null);
    }
  }, [page, query, filters]);

  return (
    <PageLayout
      title={`${query ? `${query} | ` : ''}Catalogue search`}
      description='Search through the Wellcome Collection image catalogue'
      url={{pathname: '/works', query: worksLink({query, page}).as}}
      openGraphType={'website'}
      jsonLd={{ '@type': 'WebPage' }}
      imageUrl={null}
      imageAltText={null}
    >
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
              <form
                action={'/works'}
                onSubmit={async (event) => {
                  event.preventDefault();
                  const form = event.currentTarget;
                  // $FlowFixMe
                  const newQuery = form.elements.query.value;
                  setQuery(newQuery);
                  setPage(1);

                  const newFilters = {
                    workType: workType,
                    'items.locations.locationType': showImagesOnly ? ['iiif-image'] : []
                  };
                  setFilters(newFilters);
                }}>
                <SearchBox
                  action=''
                  id='search-works'
                  name='query'
                  query={query || ''}
                  autofocus={true} />

                {showCatalogueSearchFilters &&
                    <Fragment>
                      {workTypes.map(({id, label}) => (
                        <label key={id}>
                          <input
                            type='checkbox'
                            name='workType'
                            value={id}
                            checked={workType.indexOf(id) !== -1}
                            onChange={(event) => {
                              if (event.target.checked) {
                                workType.push(id);
                              } else {
                                workType.splice(workType.indexOf(id), 1);
                              }
                              setWorkType(workType);
                            }}/>
                          {label}
                        </label>
                      ))}
                      <hr />
                      <label>
                        <input
                          type='checkbox'
                          name='showImagesOnly'
                          value={true}
                          checked={showImagesOnly}
                          onChange={(event) => setShowImagesOnly(event.target.checked)} />
                        Images only
                      </label>
                    </Fragment>
                }
              </form>
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
                        link={worksLink({query, page})}
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
                {showCatalogueSearchFilters && works.results.map(result => (
                  <NextLink
                    href={workLink({ id: result.id, query, page }).href}
                    as={workLink({ id: result.id, query, page }).as}
                    key={result.id}>
                    <a
                      style={{
                        padding: '24px 0',
                        borderTop: '1px solid'
                      }}
                      className={'plain-link ' + grid({s: 12, m: 10, l: 8, xl: 8, shiftXL: 2})}>
                      <div className={classNames({
                        [spacing({s: 1}, {margin: ['top', 'bottom']})]: true
                      })}>
                        <LinkLabels items={[
                          {
                            url: `/works?query=workType:"${result.workType.label}"`,
                            text: result.workType.label
                          }
                        ]} />
                      </div>
                      <h2 className='h4'>{result.title}</h2>
                    </a>
                  </NextLink>
                ))}
                {!showCatalogueSearchFilters && works.results.map(result => (
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
                        link={worksLink({query, page})}
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

      {works && works.results.length === 0 &&
        <div className={`row ${spacing({s: 4}, {padding: ['top']})}`}>
          <div className='container'>
            <div className='grid'>
              <div className={grid({s: 12, m: 10, l: 8, xl: 8})}>
                <p className='h1'>
                  We couldn{`'`}t find anything that matched
                  {' '}
                  <span
                    className={classNames({
                      [font({s: 'HNL1'})]: true
                    })}
                    style={{fontWeight: '400'}}
                  >
                    {query}
                  </span>.
                </p>
              </div>
            </div>
          </div>
        </div>
      }
    </PageLayout>
  );
};

Works.getInitialProps = async (
  ctx: Context
): Promise<Props> => {
  const query = ctx.query.query;
  const page = ctx.query.page ? parseInt(ctx.query.page, 10) : 1;
  const {showCatalogueSearchFilters} = ctx.query.toggles;
  const filters = showCatalogueSearchFilters ? {
    workType: workTypes.map(({id}) => id)
  } : {
    workType: ['q', 'k'],
    'items.locations.locationType': ['iiif-image']
  };

  const worksOrError = query && query !== '' ? await getWorks({ query, page, filters }) : null;

  return {
    initialPage: page,
    initialWorks: worksOrError,
    initialQuery: query,
    initialFilters: filters,
    showCatalogueSearchFilters
  };
};

export default Works;
