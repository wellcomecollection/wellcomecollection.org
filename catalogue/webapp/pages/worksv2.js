// @flow
import type {Context} from 'next';
import type {CatalogueApiError, CatalogueResultsList} from '../services/catalogue/works';
// $FlowFixMe: using react aloha for hooks, which isn't in the typedefs
import {Fragment, useEffect, useState} from 'react';
import Router from 'next/router';
import Head from 'next/head';
import NextLink from 'next/link';
import {font, grid, spacing, classNames} from '@weco/common/utils/classnames';
import convertUrlToString from '@weco/common/utils/convert-url-to-string';
import PageLayout from '@weco/common/views/components/PageLayout/PageLayout';
import InfoBanner from '@weco/common/views/components/InfoBanner/InfoBanner';
import Icon from '@weco/common/views/components/Icon/Icon';
import SearchBox from '@weco/common/views/components/SearchBox/SearchBox';
import WorkPromo from '@weco/common/views/components/WorkPromo/WorkPromo';
import Paginator from '@weco/common/views/components/Paginator/Paginator';
import ErrorPage from '@weco/common/views/components/ErrorPage/ErrorPage';
import LinkLabels from '@weco/common/views/components/LinkLabels/LinkLabels';
import StaticWorksContent from '../components/StaticWorksContent/StaticWorksContent';
import {getWorks} from '../services/catalogue/works';
import {workUrl, worksUrl} from '../services/catalogue/urls';

type Props = {|
  query: ?string,
  works: ?CatalogueResultsList | CatalogueApiError,
  page: ?number,
  filters: Object,
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
  query,
  works,
  page,
  filters,
  showCatalogueSearchFilters
}: Props) => {
  if (works && works.type === 'Error') {
    return (
      <PageLayout
        title={works.httpStatus.toString()}
        description={''}
        url={{pathname: `/works`}}
        openGraphType={'website'}
        jsonLd={{ '@type': 'WebPage' }}
        oEmbedUrl={`https://wellcomecollection.org/works`}
        imageUrl={null}
        imageAltText={null}>
        <ErrorPage
          errorStatus={works.httpStatus}
        />
      </PageLayout>
    );
  }

  const [loading, setLoading] = useState(false);
  useEffect(() => {
    function routeChangeStart(url: string) {
      setLoading(true);
    }
    function routeChangeComplete(url: string) {
      setLoading(false);
    }
    Router.events.on('routeChangeStart', routeChangeStart);
    Router.events.on('routeChangeComplete', routeChangeComplete);

    return () => {
      Router.events.off('routeChangeStart', routeChangeStart);
      Router.events.off('routeChangeComplete', routeChangeComplete);
    };
  }, []);
  const workType = filters.workType;
  const showImagesOnly = filters['items.locations.locationType'][0] === 'iiif-image';

  return (
    <Fragment>
      <Head>
        {works && works.prevPage &&
          <link
            rel='prev'
            href={convertUrlToString(worksUrl({ query, page: (page || 1) - 1 }).as)} />
        }
        {works && works.nextPage &&
          <link
            rel='next'
            href={convertUrlToString(worksUrl({ query, page: page + 1 }).as)} />
        }
      </Head>
      <PageLayout
        title={`${query ? `${query} | ` : ''}Catalogue search`}
        description='Search through the Wellcome Collection image catalogue'
        url={worksUrl({query, page}).as}
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
                  <div className='flex flex--v-center'>
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
                    const newQuery = form.elements.query.value;
                    const newWorkTypes = showCatalogueSearchFilters ? Array.from(form.elements.workType)
                      .filter(input => input.checked)
                      .map(input => input.value) : ['k', 'q'];

                    const itemsLocationsLocationType = showCatalogueSearchFilters
                      ? form.elements.showImagesOnly.checked ? ['iiif-image'] : [] : ['iiif-image'];
                    const link = worksUrl({
                      query: newQuery,
                      page: 1,
                      workType: newWorkTypes,
                      itemsLocationsLocationType
                    });
                    Router.push(link.href, link.as);
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
                        <label key={id} style={{
                          display: 'inline-block',
                          padding: '0 6px',
                          borderRadius: '4px',
                          border: '2px solid #5cb8bf',
                          marginBottom: '6px'
                        }}>
                          <input
                            type='checkbox'
                            name='workType'
                            value={id}
                            defaultChecked={workType.indexOf(id) !== -1}
                            style={{
                              marginRight: '6px'
                            }} />
                          {label}
                        </label>
                      ))}
                      <hr />
                      <label>
                        <input
                          type='checkbox'
                          name='showImagesOnly'
                          value={true}
                          defaultChecked={showImagesOnly} />
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

        {!works &&
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
                          currentPage={page || 1}
                          pageSize={works.pageSize}
                          totalResults={works.totalResults}
                          link={worksUrl({query, page})}
                          onPageChange={async (event, newPage) => {
                            event.preventDefault();
                            const link = worksUrl({ query, page: newPage });
                            Router.push(link.href, link.as);
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
                      href={workUrl({ id: result.id, query, page }).href}
                      as={workUrl({ id: result.id, query, page }).as}
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
                              url: null,
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
                        link={workUrl({ id: result.id, query, page })} />
                    </div>
                  ))}
                </div>
              </div>

              <div className={`row ${spacing({s: 10}, {padding: ['top', 'bottom']})}`}>
                <div className='container'>
                  <div className='grid'>
                    <div className='grid__cell'>
                      <div className='flex flex--h-space-between flex--v-center'>
                        <Fragment>
                          <Paginator
                            currentPage={page || 1}
                            pageSize={works.pageSize}
                            totalResults={works.totalResults}
                            link={worksUrl({query, page})}
                            onPageChange={async (event, newPage) => {
                              event.preventDefault();
                              const link = worksUrl({ query, page: newPage });
                              Router.push(link.href, link.as);
                            }}
                          />
                        </Fragment>
                      </div>
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
    </Fragment>
  );
};

Works.getInitialProps = async (
  ctx: Context
): Promise<Props> => {
  const query = ctx.query.query;
  const page = ctx.query.page ? parseInt(ctx.query.page, 10) : 1;
  const workType = ctx.query.workType ? ctx.query.workType.split(',') : ['k', 'q'];
  const itemsLocationsLocationType = 'items.locations.locationType' in ctx.query
    ? ctx.query['items.locations.locationType'].split(',') : ['iiif-image'];

  const {showCatalogueSearchFilters} = ctx.query.toggles;
  const filters = {
    'items.locations.locationType': itemsLocationsLocationType,
    workType
  };

  const worksOrError = query && query !== '' ? await getWorks({ query, page, filters }) : null;

  return {
    page: page,
    works: worksOrError,
    query: query,
    filters: filters,
    showCatalogueSearchFilters
  };
};

export default Works;
