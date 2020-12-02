import { FunctionComponent } from 'react';
import { GetServerSideProps } from 'next';
import {
  appError,
  AppErrorProps,
  WithPageview,
} from '@weco/common/views/pages/_app';
import { Work, Image } from '@weco/common/model/catalogue';
import { imageLink } from '@weco/common/services/catalogue/routes';
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
  langCode: string;
  globalContextData: GlobalContextData;
} & WithPageview;

const ImagePage: FunctionComponent<Props> = ({
  image,
  sourceWork,
  langCode,
  globalContextData,
}: Props) => {
  const title = sourceWork.title || '';
  const iiifImageLocation = image.locations[0];

  const sharedPaginatorProps = {
    totalResults: 1,
    link: imageLink({
      workId: sourceWork.id,
      id: image.id,
      langCode,
    }),
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
          currentCanvas={null}
          lang={langCode}
          canvasOcr={null}
          canvases={[]}
          workId={sourceWork.id}
          pageIndex={0}
          sierraId=""
          pageSize={1}
          canvasIndex={0}
          iiifImageLocation={iiifImageLocation}
          work={sourceWork}
          manifest={null}
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
  const { id, workId, langCode = 'en' } = context.query;

  if (!id) {
    return { notFound: true };
  }

  const image = await getImage({
    id,
    toggles: context.query.toggles,
  });

  if (image.type === 'Error') {
    if (image.httpStatus === 404) {
      return { notFound: true };
    }
    return appError(context, image.statusCode, 'Images API error');
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
    toggles: context.query.toggles,
  });

  if (work.type === 'Error') {
    if (work.httpStatus === 404) {
      return { notFound: true };
    }
    return appError(context, work.statusCode, 'Works API error');
  }

  return {
    props: removeUndefinedProps({
      image,
      langCode: langCode.toString(),
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
