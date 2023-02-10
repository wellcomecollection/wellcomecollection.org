import { FunctionComponent } from 'react';
import { GetServerSideProps } from 'next';
import { appError, AppErrorProps } from '@weco/common/services/app';
import { Work, Image } from '@weco/common/model/catalogue';
import { toLink as imageLink } from '@weco/common/views/components/ImageLink/ImageLink';
import CataloguePageLayout from '@weco/catalogue/components/CataloguePageLayout/CataloguePageLayout';
import Layout12 from '@weco/common/views/components/Layout12/Layout12';
import BetaMessage from '@weco/common/views/components/BetaMessage/BetaMessage';
import Space from '@weco/common/views/components/styled/Space';
import IIIFViewer from '@weco/catalogue/components/IIIFViewer/IIIFViewer';
import { removeUndefinedProps } from '@weco/common/utils/json';
import { getWork } from '@weco/catalogue/services/catalogue/works';
import { getImage } from '@weco/catalogue/services/catalogue/images';
import { getServerData } from '@weco/common/server-data';
import { unavailableImageMessage } from '@weco/common/data/microcopy';
import { Pageview } from '@weco/common/services/conversion/track';
import { looksLikeCanonicalId } from '@weco/catalogue/services/catalogue';
import { createDefaultTransformedManifest } from '@weco/catalogue/types/manifest';
import {
  ApiToolbarLink,
  setTzitzitParams,
} from '@weco/common/views/components/ApiToolbar';

function createTzitzitImageLink(
  work: Work,
  image: Image
): ApiToolbarLink | undefined {
  return setTzitzitParams({
    title: image.source.title,
    sourceLink: `/works/${work.id}/images`,
    licence: image.locations[0].license,
    contributors: image.source.contributors,
  });
}

type Props = {
  image: Image;
  catalogueApiUrl: string;
  sourceWork: Work;
  pageview: Pageview;
};

const ImagePage: FunctionComponent<Props> = ({
  image,
  sourceWork,
  catalogueApiUrl,
}) => {
  const title = sourceWork.title || '';
  const iiifImageLocation = image.locations[0];

  const sharedPaginatorProps = {
    totalResults: 1,
    currentPage: 1,
    pageSize: 1,
    link: imageLink(
      {
        workId: sourceWork.id,
        id: image.id,
      },
      'viewer/paginator'
    ),
  };

  const mainPaginatorProps = {
    linkKey: 'canvas',
    ...sharedPaginatorProps,
  };

  const thumbsPaginatorProps = {
    linkKey: 'page',
    ...sharedPaginatorProps,
  };

  // We only send a langCode if it's unambiguous -- better to send no language
  // than the wrong one.
  const lang =
    (sourceWork.languages.length === 1 && sourceWork?.languages[0]?.id) || '';

  const apiLink = {
    id: 'json',
    label: 'JSON',
    link: catalogueApiUrl,
  };

  return (
    <CataloguePageLayout
      title={title}
      description={''}
      url={{
        pathname: `/works/${sourceWork.id}/images`,
        query: { id: image.id },
      }}
      openGraphType="website"
      jsonLd={{ '@type': 'WebPage' }}
      siteSection="collections"
      apiToolbarLinks={[apiLink, createTzitzitImageLink(sourceWork, image)]}
      hideNewsletterPromo={true}
      hideFooter={true}
      hideTopContent={true}
    >
      {iiifImageLocation ? (
        <IIIFViewer
          title={title}
          mainPaginatorProps={mainPaginatorProps}
          thumbsPaginatorProps={thumbsPaginatorProps}
          lang={lang}
          transformedManifest={createDefaultTransformedManifest()}
          workId={sourceWork.id}
          pageIndex={0}
          pageSize={1}
          canvasIndex={0}
          iiifImageLocation={iiifImageLocation}
          work={sourceWork}
        />
      ) : (
        <Layout12>
          <Space v={{ size: 'l', properties: ['margin-bottom'] }}>
            <div style={{ marginTop: '98px' }}>
              <BetaMessage message={unavailableImageMessage} />
            </div>
          </Space>
        </Layout12>
      )}
    </CataloguePageLayout>
  );
};

export const getServerSideProps: GetServerSideProps<Props | AppErrorProps> =
  async context => {
    const serverData = await getServerData(context);
    const { id, workId } = context.query;

    if (!looksLikeCanonicalId(id) || !looksLikeCanonicalId(workId)) {
      return { notFound: true };
    }

    const { url: catalogueApiUrl, image } = await getImage({
      id,
      toggles: serverData.toggles,
    });

    if (image.type === 'Error') {
      if (image.httpStatus === 404) {
        return { notFound: true };
      }
      return appError(context, image.httpStatus, image.description);
    }

    // This is to avoid exposing a URL that has a valid `imageId` in it
    // but not the correct `workId`, which would technically work,
    // but the data on the page would be incorrect. e.g:
    // image: { id: '1234567', image.source.id: 'abcdefg' }
    // url: /works/gfedcba/images?id=1234567
    if (image.source.id !== workId) {
      return { notFound: true };
    }

    const work = await getWork({
      id: workId,
      toggles: serverData.toggles,
    });

    if (work.type === 'Error') {
      if (work.httpStatus === 404) {
        return { notFound: true };
      }
      return appError(context, work.httpStatus, work.description);
    } else if (work.type === 'Redirect') {
      return {
        redirect: {
          destination: `/works/${work.redirectToId}`,
          permanent: work.status === 301,
        },
      };
    }

    return {
      props: removeUndefinedProps({
        image,
        // We know we'll get a catalogue API URL for a non-error response, but
        // this isn't (currently) asserted by the type system.
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        catalogueApiUrl: catalogueApiUrl!,
        sourceWork: work,
        pageview: {
          name: 'image',
          properties: {},
        },
        serverData,
      }),
    };
  };

export default ImagePage;
