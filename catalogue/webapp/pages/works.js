import fetch from 'isomorphic-unfetch';
import Link from 'next/link';
import { withFormik } from 'formik';
import {font, grid, spacing, classNames} from '@weco/common/utils/classnames';
import criticalCss from '@weco/common/styles/critical.scss';
import DefaultPageLayout from '@weco/common/views/components/DefaultPageLayout/DefaultPageLayout';
import PageDescription from '@weco/common/views/components/PageDescription/PageDescription';
import InfoBanner from '@weco/common/views/components/InfoBanner/InfoBanner';
import Icon from '@weco/common/views/components/Icon/Icon';
import HTMLInput from '@weco/common/views/components/HTMLInput/HTMLInput';

type Props = {|
  values: {| query: string, works: Object |},
  isSubmitting: boolean,
  handleChange: () => void,
  handleSubmit: () => void
|}

const SearchWorks = ({
  values: {query, works},
  handleSubmit,
  handleChange,
  isSubmitting
}: Props) => (
  <DefaultPageLayout
    title='Image catalogue search | Wellcome Collection'
    description='Search through the Wellcome Collection image catalogue'
    analyticsCategory='collections'
  >

    <style dangerouslySetInnerHTML={{ __html: criticalCss }} />
    <PageDescription title='Search our images' modifiers={{hidden: true}} />
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
            <div className='search-box js-search-box'>
              <form action='/works' onSubmit={handleSubmit}>
                <HTMLInput
                  id='search-works'
                  type='text'
                  name='query'
                  value={query}
                  placeholder='Search for artworks, photos and more'
                  autofocus={!query}
                  isLabelHidden={true}
                  onChange={handleChange} />

                <div className='search-box__button-wrap absolute bg-elf-green'>
                  <button className={classNames([
                    'search-box__button line-height-1 plain-button no-padding',
                    font({s: 'HNL3', m: 'HNL2'})
                  ])} disabled={isSubmitting}>
                    <span className='flex flex--v-center flex--h-center'>
                      <Icon name='search' title='Search' extraClasses='icon--white' />
                    </span>
                  </button>
                </div>
                {works.totalResults}
              </form>
              <button
                className='search-box__clear absolute line-height-1 plain-button v-center no-padding js-clear'
                data-track-event={JSON.stringify({category: 'component', action: 'clear-search:click', label: 'input-id:search-works'})}
                type='button'>
                <Icon name='clear' title='clear' />
              </button>
            </div>
            {!query
              ? <p className={classNames([
                spacing({s: 4}, {margin: ['top']}),
                font({s: 'HNL4', m: 'HNL3'})
              ])}>Find thousands of Creative Commons licensed images from historical library materials and museum objects to contemporary digital photographs.</p>
              :                <p className={classNames([
                spacing({s: 2}, {margin: ['top', 'bottom']}),
                font({s: 'LR3', m: 'LR2'})
              ])}>{works.totalResults !== 0 ? works.totalResults : 'No'} results for &apos;{query}&apos;
              </p>
            }
          </div>
        </div>
      </div>
    </div>
    <ul>
      {works.results.map(work =>
        <li key={work.id}>
          <Link as={`/works/${work.id}`} href={`/work?id=${work.id}`}>
            <a>{work.title}</a>
          </Link>
        </li>
      )}
    </ul>
  </DefaultPageLayout>
);

const WorksPage = withFormik({
  mapPropsToValues: props => props, // this passed the initial props from `getInitialProps down`
  handleSubmit: async ({query, works}, actions) => {
    const res = await fetch(`https://api.wellcomecollection.org/catalogue/v1/works?query=${query}`);
    const json = await res.json();
    actions.setValues({ works: json, query });
    actions.setSubmitting(false);
  }
})(SearchWorks);

WorksPage.getInitialProps = async ({ req }) => {
  const res = await fetch(`https://api.wellcomecollection.org/catalogue/v1/works`);
  const json = await res.json();
  return { works: json, query: '' };
};

export default WorksPage;
