// @flow
import { type Context } from 'next';
import { type Work, type Image } from '@weco/common/model/catalogue';
import { imageLink } from '@weco/common/services/catalogue/routes';
import { getWork } from '../services/catalogue/works';
import { getImage } from '../services/catalogue/images';
// $FlowFixMe (tsx)
import CataloguePageLayout from '@weco/common/views/components/CataloguePageLayout/CataloguePageLayout';
import Layout12 from '@weco/common/views/components/Layout12/Layout12';
import IIIFViewer from '@weco/common/views/components/IIIFViewer/IIIFViewer';
import BetaMessage from '@weco/common/views/components/BetaMessage/BetaMessage';
import Space from '@weco/common/views/components/styled/Space';
import {
  GlobalContextData,
  getGlobalContextData,
  // $FlowFixMe (tsx)
} from '@weco/common/views/components/GlobalContextProvider/GlobalContextProvider';

type Props = {|
  image: Image,
  sourceWork: Work,
  langCode: string,
  globalContextData: GlobalContextData,
|};

const ImagePage = ({
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

export const getServerSideProps = async (
  ctx: Context
): Promise<{ props: Props }> => {
  const globalContextData = getGlobalContextData(ctx);
  const { id, workId, langCode = 'en' } = ctx.query;
  if (!id) {
    // $FlowFixMe
    return { statusCode: 404 };
  }

  const image = await getImage({
    id,
    toggles: ctx.query.toggles,
  });
  if (image.type === 'Error' || image.source.id !== workId) {
    // $FlowFixMe
    return { statusCode: 404 };
  }

  const work = await getWork({
    id: workId,
    toggles: ctx.query.toggles,
  });
  if (work.type === 'Error') {
    // $FlowFixMe
    return { statusCode: 404 };
  }

  return {
    props: {
      image,
      langCode,
      sourceWork: work,
      globalContextData,
    },
  };
};

export default ImagePage;
