// @flow

import fetch from 'isomorphic-unfetch';
import {font, grid, spacing, classNames} from '@weco/common/utils/classnames';
import criticalCss from '@weco/common/styles/critical.scss';
import DefaultPageLayout from '@weco/common/views/components/DefaultPageLayout/DefaultPageLayout';
import PageDescription from '@weco/common/views/components/PageDescription/PageDescription';
import InfoBanner from '@weco/common/views/components/InfoBanner/InfoBanner';
import Icon from '@weco/common/views/components/Icon/Icon';
import Tags from '@weco/common/views/components/Tags/Tags';
import SearchBox from '@weco/common/views/components/SearchBox/SearchBox';
import Image from '@weco/common/views/components/Image/Image';
import Tasl from '@weco/common/views/components/Tasl/Tasl';
import CaptionedImage from '@weco/common/views/components/CaptionedImage/CaptionedImage';
import Promo from '@weco/common/views/components/Promo/Promo';
import Pagination, {PaginationFactory} from '@weco/common/views/components/Pagination/Pagination';
import {Fragment, Component} from 'react';
import Router from 'next/router';

type Props = {|
  values: {| query: string, works: {results: [], totalResults: number}, pagination: Object |},
  handleSubmit: () => void,
  url: {
    query: {
      query?: string,
      page?: number
    }
  }
|}

type State = {|
  works: {
    results: [],
    totalResults: number
  },
  query: string,
  pagination: {}
|}

const WorksComponent = ({
  values: {query, works, pagination},
  handleSubmit,
  handleChange
}: Props) => (
  <DefaultPageLayout
    title='Image catalogue search | Wellcome Collection'
    description='Search through the Wellcome Collection image catalogue'
  >

    <style dangerouslySetInnerHTML={{ __html: criticalCss }} />
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
              <div className='flex flex--v-center'>
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
              query={query}
              autofocus={true}
              onChange={handleChange}
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
      <Fragment>
        <div className={`row ${spacing({s: 3, m: 5}, {padding: ['top']})}`}>
          <div className="container">
            <div className="grid">
              <div className="grid__cell">
                <h3 className={font({s: 'WB6', m: 'WB4'})}>Feeling curious?</h3>
                <p className={`${spacing({s: 2}, {margin: ['bottom']})} ${font({s: 'HNL4', m: 'HNL3'})}`}>Discover our collections through these topics.</p>
                <div className={spacing({s: 4}, {margin: ['bottom']})}>
                  <Tags tags={[
                    {text: 'Quacks', url: '/works?query=quack+OR+quacks'},
                    {text: 'James Gillray', url: '/works?query=james+gillray'},
                    {text: 'Botany', url: '/works?query=botany'},
                    {text: 'Optics', url: '/works?query=optics'},
                    {text: 'Sun', url: '/works?query=sun'},
                    {text: 'Health', url: '/works?query=health'},
                    {text: 'Paintings', url: '/works?query=paintings'},
                    {text: 'Science', url: '/works?query=science'}
                  ]} />
                </div>
                <hr className={`divider divider--dashed ${spacing({s: 6}, {margin: ['bottom']})}`} />
              </div>
            </div>
          </div>
        </div>
        <div className={`row bg-cream row--has-wobbly-background ${spacing({s: 10}, {padding: ['bottom']})}`}>
          <div className="container">
            <div className="row__wobbly-background"></div>
            <div className="grid grid--dividers">
              <div className={grid({s: 12, m: 10, l: 7, xl: 7})}>
                <h2 className={`${font({s: 'WB6', m: 'WB4'})} ${spacing({s: 6}, {margin: ['bottom']})} ${spacing({s: 0}, {margin: ['top']})}`}>About the historical images</h2>
                <div className="body-content">
                  <div className={`standfirst ${font({s: 'HNL3', m: 'HNL2'})}`}>
                    <p>These artworks and photographs are from the library at Wellcome Collection and have been collected over several decades. </p>
                  </div>

                  <p>Most of the works were acquired between 1890 and 1936 by Sir Henry Wellcome and his agents across the globe. The images reflect Wellcome’s collecting interests and were intended to form a documentary resource that reflects the cultural and historical contexts of health and medicine.</p>

                  <p>You may find some of these representations of people and cultures offensive or distressing. On occasion individuals are depicted as research subjects, and the collection includes images of nakedness, medical conditions and surgical interventions.</p>

                  <p>Wellcome had a personal interest in medical and ethnographic objects and the objects, artworks and photographs he collected were initially presented in the Wellcome Historical Medical Museum. Over the subsequent decades the library and its collections developed to become Wellcome Collection as it now is: a free museum and library exploring health, life and our place in the world.</p>

                  <p>Many of the images on this site were digitised during the 1990s, and first made available online in 2002. Recent developments to the site have made these images more easily discoverable, but have also made the sensitive nature of some content more visible, and revealed the poor quality of some of the early digitisation.</p>

                  <p>As we make more images from our collections available over the coming months, we will identify and consider these issues in a systematic and consistent manner. We want to include a range of voices from inside and outside Wellcome Collection to help us with this. If you would like to get involved or have information about an image which might help us to understand it better, please email <a href="mailto:collections@wellcome.ac.uk">collections@wellcome.ac.uk</a>.</p>
                </div>
              </div>
              <div className={grid({s: 12, m: 8, l: 5, xl: 5})}>
                <CaptionedImage caption='Sir Henry Solomon Wellcome (1853&ndash;1936). Pharmacist, entrepreneur, philanthropist and collector.'>
                  <Image
                    contentUrl='https://s3-eu-west-1.amazonaws.com/miro-images-public/V0027000/V0027772.jpg'
                    width={1600}
                    alt='Portrait of Henry Wellcome'
                    lazyload={true} />
                  <Tasl
                    contentUrl='https://s3-eu-west-1.amazonaws.com/miro-images-public/V0027000/V0027772.jpg'
                    isFull={false}
                    title='Sir Henry Solomon Wellcome. Photograph by Lafayette Ltd'
                    sourceName='Wellcome Collection'
                    sourceLink='https://wellcomecollection.org/works/a2d9ywt8' />
                </CaptionedImage>
              </div>
            </div>
          </div>
        </div>
      </Fragment>
    }

    {query &&
      <Fragment>
        <div className={`row ${spacing({s: 3, m: 5}, {padding: ['top']})}`}>
          <div className="container">
            <div className="grid">
              <div className="grid__cell">
                <div className="flex flex--h-space-between flex--v-center">
                  {pagination && pagination.range &&
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
                  }
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className={`row ${spacing({s: 4}, {padding: ['top']})}`}>
          <div className="container">
            <div className="grid">
              {works.results.map(result => (
                <div key={result.id} className={grid({s: 6, m: 4, l: 3, xl: 2})}>
                  <Promo
                    sizes='(min-width: 1340px) 178px, (min-width: 960px) calc(25vw - 52px), (min-width: 600px) calc(33.24vw - 43px), calc(50vw - 27px)'
                    id={result.id}
                    contentType='work'
                    image={{
                      contentUrl: result.thumbnail && result.thumbnail.url,
                      width: 300,
                      height: 300,
                      alt: ''
                    }}
                    datePublished={result.createdDate && result.createdDate.label}
                    isConstrained={true}
                    title={result.title}
                    defaultSize={180}
                    url={`/works/${result.id}`} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </Fragment>
    }
  </DefaultPageLayout>
);

class Works extends Component<Props, State> {
  handleSubmit: Function;
  static getInitialProps: Function;

  constructor(props: Props) {
    super(props);

    this.state = {
      query: props.query,
      works: {
        results: props.works.results,
        totalResults: props.works.totalResults
      },
      pagination: props.pagination
    };

    this.handleSubmit = this.handleSubmit.bind(this);
  }
  async handleSubmit(event: any) {
    event.preventDefault();

    const query = event.target[0].value; // the input
    const res = await fetch(`https://api.wellcomecollection.org/catalogue/v1/works?query=${query}&includes=identifiers,thumbnail,items`);
    const json = await res.json();
    const currentPage = 1;
    const pagination = PaginationFactory.fromList(json.results, parseInt(json.totalResults, 10) || 1, parseInt(currentPage, 10) || 1, json.pageSize || 1, {query});

    this.setState({
      works: json,
      pagination: pagination,
      query: query
    });

    // Programatically update the URL
    Router.push({
      pathname: '/works',
      query: {query: query, page: 1}
    })
  }

  render() {
    return (
      <WorksComponent
        values={{
          query: this.state.query,
          works: this.state.works,
          pagination: this.state.pagination
        }}
        handleSubmit={this.handleSubmit}
        url={{query: {}}} />
    );
  }
}

Works.getInitialProps = async ({ req, query }) => {
  const res = await fetch(`https://api.wellcomecollection.org/catalogue/v1/works${getQueryParams(query)}`);
  const json = await res.json();

  const currentPage = query.page || 1;
  const pagination = PaginationFactory.fromList(json.results, parseInt(json.totalResults, 10) || 1, parseInt(currentPage, 10) || 1, json.pageSize || 1, {query: query.query});

  return {
    works: json,
    query: query.query,
    pagination: pagination
  };
};

export default Works;

function getQueryParams(query) {
  const defaults = '?includes=identifiers,thumbnail,items';
  const extra = Object.keys(query).reduce((acc, currKey) => {
    return `${acc}&${currKey}=${query[currKey]}`;
  }, '');

  return `${defaults}${extra}`;
}
