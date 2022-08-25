import { GetServerSideProps, NextPage } from 'next';
import {
  CatalogueResultsList,
  Concept as ConceptType,
  Image as ImageType,
  Work as WorkType,
} from '@weco/common/model/catalogue';
import { removeUndefinedProps } from '@weco/common/utils/json';
import { appError, AppErrorProps } from '@weco/common/views/pages/_app';
import { getServerData } from '@weco/common/server-data';
import { isString } from '@weco/common/utils/array';
import { getConcept } from 'services/catalogue/concepts';
import CataloguePageLayout from 'components/CataloguePageLayout/CataloguePageLayout';
import { getWorks } from '../services/catalogue/works';
import ImageEndpointSearchResults from 'components/ImageEndpointSearchResults/ImageEndpointSearchResults';
import { getImages } from 'services/catalogue/images';
import WorksSearchResults from '../components/WorksSearchResults/WorksSearchResults';

type Props = {
  conceptResponse: ConceptType;
  works: CatalogueResultsList<WorkType> | undefined;
  images: CatalogueResultsList<ImageType> | undefined;
};

export const ConceptPage: NextPage<Props> = ({
  conceptResponse,
  works,
  images,
}) => {
  const conceptsJson = JSON.stringify(conceptResponse);
  const workJson = JSON.stringify(works);
  const imagesJson = JSON.stringify(images);

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
        <p>
          <strong>Label</strong>
          <br />
          {conceptResponse.label}
        </p>

        <strong>Identifiers</strong>
        <ul>
          {conceptResponse.identifiers?.map(id => (
            <li key={id.value}>
              {id.identifierType.label} {id.value}
            </li>
          ))}
        </ul>

        <hr />

        <p>
          <h2>Matching images</h2>
        </p>

        {images && images.totalResults ? (
          <>
            <ImageEndpointSearchResults images={images} />
            <p>
              <a
                href={`/images?source.subjects.label=${conceptResponse.label}`}
              >
                see all matching images ({images.totalResults}) &rarr;
              </a>
            </p>
          </>
        ) : (
          <p>There are no matching images</p>
        )}

        <hr />

        <p>
          <h2>Matching works</h2>
        </p>

        {works && works.totalResults ? (
          <>
            <WorksSearchResults works={works} />
            <p>
              <a href={`/works?subjects.label=${conceptResponse.label}`}>
                see all matching works ({works.totalResults}) &rarr;
              </a>
            </p>
          </>
        ) : (
          <p>There are no matching works</p>
        )}

        <hr />

        <p>
          <h2>Debug information</h2>
        </p>
        <p>
          <details>
            <summary>Concepts API response</summary>
            <p>{conceptsJson}</p>
          </details>

          <details>
            <summary>Works API response</summary>
            <p>{workJson}</p>
          </details>

          <details>
            <summary>Images API response</summary>
            <p>{imagesJson}</p>
          </details>
        </p>
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

    const conceptResponse = await getConcept({
      id,
      toggles: serverData.toggles,
    });

    const worksPromise = getWorks({
      params: { 'subjects.label': [conceptResponse.label] },
      toggles: serverData.toggles,
      pageSize: 5,
    });

    const imagesPromise = getImages({
      params: { 'source.subjects.label': [conceptResponse.label] },
      toggles: serverData.toggles,
      pageSize: 5,
    });

    const [worksResponse, imagesResponse] = await Promise.all([
      worksPromise,
      imagesPromise,
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

    const works = worksResponse.type === 'Error' ? undefined : worksResponse;
    const images = imagesResponse.type === 'Error' ? undefined : imagesResponse;

    return {
      props: removeUndefinedProps({
        conceptResponse,
        works,
        images,
        serverData,
      }),
    };
  };

export default ConceptPage;
