import { GetServerSideProps, NextPage } from 'next';
import {
  Concept as ConceptType,
  Work as WorkType,
  Image as ImageType,
  CatalogueResultsList,
} from '@weco/common/model/catalogue';
import { removeUndefinedProps } from '@weco/common/utils/json';
import { appError, AppErrorProps } from '@weco/common/views/pages/_app';
import { getServerData } from '@weco/common/server-data';
import { isString } from '@weco/common/utils/array';
import { getConcept, getConcepts } from 'services/catalogue/concepts';
import CataloguePageLayout from 'components/CataloguePageLayout/CataloguePageLayout';
import { getWorks } from '../services/catalogue/works';
import PageHeader from '@weco/common/views/components/PageHeader/PageHeader';
import { Fragment } from 'react';
import { classNames } from '@weco/common/utils/classnames';
import Space from '@weco/common/views/components/styled/Space';
import WorkDetailsSection from 'components/WorkDetailsSection/WorkDetailsSection';
import WorkDetailsTags from 'components/WorkDetailsTags/WorkDetailsTags';
import { getImages } from 'services/catalogue/images';
import ImageEndpointSearchResults from '../components/ImageEndpointSearchResults/ImageEndpointSearchResults';
import WorksSearchResults from '../components/WorksSearchResults/WorksSearchResults';

type Props = {
  concepts: CatalogueResultsList<ConceptType>;
};

export const ConceptPage: NextPage<Props> = ({ concepts }) => {
  return (
    <CataloguePageLayout
      title={'Concepts'}
      description={'<TBC>'}
      url={{ pathname: '/concepts' }}
      openGraphType={'website'}
      siteSection={'collections'}
      jsonLd={{ '@type': 'WebPage' }}
      hideNewsletterPromo={true}
    >
      <div className="container">
        <p>
          <h1>Concepts</h1>
        </p>
        <ul>
          {concepts.results.map(c => (
            <li>
              <a href={`/concepts/${c.id}`}>{c.label}</a>
            </li>
          ))}
        </ul>
      </div>
    </CataloguePageLayout>
  );
};

export const getServerSideProps: GetServerSideProps<Props | AppErrorProps> =
  async context => {
    const serverData = await getServerData(context);

    // Note: These pages don't need to be behind a toggle, but I'm putting them here
    // as a way to test the concepts toggle.
    //
    // We will want a toggle in place for linking to concepts from works pages.
    if (!serverData.toggles.conceptsPages) {
      return { notFound: true };
    }

    const concepts = await getConcepts({
      params: {},
      toggles: serverData.toggles,
    });

    return {
      props: removeUndefinedProps({
        concepts,
        serverData,
      }),
    };
  };

export default ConceptPage;
