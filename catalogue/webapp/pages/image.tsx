import { FunctionComponent } from 'react';
import { GetServerSideProps } from 'next';
import {
  appError,
  AppErrorProps,
  WithPageview,
} from '@weco/common/views/pages/_app';
import { Work, Image } from '@weco/common/model/catalogue';
import { toLink as imageLink } from '@weco/common/views/components/ImageLink/ImageLink';
import CataloguePageLayout from '@weco/common/views/components/CataloguePageLayout/CataloguePageLayout';
import Layout12 from '@weco/common/views/components/Layout12/Layout12';
import IIIFViewer from '@weco/common/views/components/IIIFViewer/IIIFViewer';
import BetaMessage from '@weco/common/views/components/BetaMessage/BetaMessage';
import Space from '@weco/common/views/components/styled/Space';
import {
  GlobalContextData,
  getGlobalContextData,
} from '@weco/common/views/components/GlobalContextProvider/GlobalContextProvider';
import { removeUndefinedProps } from '@weco/common/utils/json';
import { getWork } from '../services/catalogue/works';
import { getImage } from '../services/catalogue/images';

type Props = {
  image: Image;
  sourceWork: Work;
  globalContextData: GlobalContextData;
} & WithPageview;

const ImagePage: FunctionComponent<Props> = ({
  image,
  sourceWork,
  globalContextData,
}: Props) => {
  const title = sourceWork.title || '';
  const iiifImageLocation = image.locations[0];

  const sharedPaginatorProps = {
    totalResults: 1,
    link: imageLink(
      {
        workId: sourceWork.id,
        id: image.id,
      },
      'viewer/paginator'
    ),
  };

  const mainPaginatorProps = {
    currentPage: 1,
    pageSize: 1,
    linkKey: 'canvas',
    ...sharedPaginatorProps,
  };

  const thumbsPaginatorProps = {
    currentPage: 1,
    pageSize: 1,
    linkKey: 'page',
    ...sharedPaginatorProps,
  };

  return (
    <CataloguePageLayout
      title={title}
      description={''}
      url={{
        pathname: `/works/${sourceWork.id}/images`,
        query: { id: image.id },
      }}
      openGraphType={'website'}
      jsonLd={{ '@type': 'WebPage' }}
      siteSection={'collections'}
      imageUrl={'imageContentUrl'}
      imageAltText={''}
      hideNewsletterPromo={true}
      hideFooter={true}
      hideInfoBar={true}
      globalContextData={globalContextData}
    >
      {iiifImageLocation ? (
        <IIIFViewer
          title={title}
          mainPaginatorProps={mainPaginatorProps}
          thumbsPaginatorProps={thumbsPaginatorProps}
          // We only send a langCode if it's unambiguous -- better to send no language
          // than the wrong one.
          lang={
            (sourceWork.languages.length === 1 &&
              sourceWork?.languages[0]?.id) ||
            ''
          }
          canvases={[]}
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
              <BetaMessage message="We are working to make this image available online." />
            </div>
          </Space>
        </Layout12>
      )}
    </CataloguePageLayout>
  );
};

export const getServerSideProps: GetServerSideProps<
  Props | AppErrorProps
> = async context => {
  const globalContextData = getGlobalContextData(context);
  const { id, workId } = context.query;

  if (typeof id !== 'string') {
    return { notFound: true };
  }

  const image = await getImage({
    id,
    toggles: globalContextData.toggles,
  });

  if (image.type === 'Error') {
    if (image.httpStatus === 404) {
      return { notFound: true };
    }
    return appError(context, image.httpStatus, 'Images API error');
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
    toggles: globalContextData.toggles,
  });

  if (work.type === 'Error') {
    if (work.httpStatus === 404) {
      return { notFound: true };
    }
    return appError(context, work.httpStatus, work.description);
  } else if (work.type === 'Redirect') {
    return {
      redirect: {
        destination: `/works/${work.redirectToId}/images`,
        permanent: work.status === 301,
      },
    };
  }

  return {
    props: removeUndefinedProps({
      image,
      sourceWork: work,
      pageview: {
        name: 'image',
        properties: {},
      },
      globalContextData,
    }),
  };
};

export default ImagePage;
