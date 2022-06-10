import { GetServerSideProps, NextPage } from 'next';
import {
  Concept as ConceptType,
  Work as WorkType,
} from '@weco/common/model/catalogue';
import { removeUndefinedProps } from '@weco/common/utils/json';
import { appError, AppErrorProps } from '@weco/common/views/pages/_app';
import { getServerData } from '@weco/common/server-data';
import { isString } from '@weco/common/utils/array';
import { getConcept } from 'services/catalogue/concepts';
import CataloguePageLayout from 'components/CataloguePageLayout/CataloguePageLayout';
import { getWorks } from '../services/catalogue/works';

type Props = {
  conceptResponse: ConceptType;
  works: WorkType[];
};

export const ConceptPage: NextPage<Props> = ({ conceptResponse, works }) => {
  const conceptsJson = JSON.stringify(conceptResponse);
  const workJson = JSON.stringify(works);

  return (
    <CataloguePageLayout
      title={conceptResponse.label}
      description={'<TBC>'}
      url={{ pathname: `/concepts/${conceptResponse.id}`, query: {} }}
      openGraphType={'website'}
      siteSection={'collections'}
      jsonLd={{ '@type': 'WebPage' }}
      hideNewsletterPromo={true}
    >
      <div className="container">
        <h1>Concepts API response:</h1>
        <p>{conceptsJson}</p>
        <h1>Associated works:</h1>
        <p>{workJson}</p>
      </div>
    </CataloguePageLayout>
  );
};

export const getServerSideProps: GetServerSideProps<Props | AppErrorProps> =
  async context => {
    const serverData = await getServerData(context);
    const { id } = context.query;

    // Note: These pages don't need to be behind a toggle, but I'm putting them here
    // as a way to test the concepts toggle.
    //
    // We will want a toggle in place for linking to concepts from works pages.
    if (!serverData.toggles.conceptsPages) {
      return { notFound: true };
    }

    if (!isString(id)) {
      return { notFound: true };
    }

    const conceptPromise = getConcept({
      id,
      toggles: serverData.toggles,
    });

    const worksPromise = getWorks({
      params: { subjects: [id] },
      toggles: serverData.toggles,
    });

    const [conceptResponse, worksResponse] = await Promise.all([
      conceptPromise,
      worksPromise,
    ]);

    if (conceptResponse.type === 'Error') {
      if (conceptResponse.httpStatus === 404) {
        return { notFound: true };
      }
      return appError(
        context,
        conceptResponse.httpStatus,
        conceptResponse.description
      );
    }

    const works = worksResponse.type === 'Error' ? [] : worksResponse.results;

    return {
      props: removeUndefinedProps({
        conceptResponse,
        works,
        serverData,
      }),
    };
  };

export default ConceptPage;
