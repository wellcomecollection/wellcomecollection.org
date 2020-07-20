// @flow
import { type Context } from 'next';
import { type Work, type Image } from '@weco/common/model/catalogue';
import { imageLink } from '@weco/common/services/catalogue/routes';
import { getWork } from '../services/catalogue/works';
import { getImage } from '../services/catalogue/images';
import CataloguePageLayout from '@weco/common/views/components/CataloguePageLayout/CataloguePageLayout';
import Layout12 from '@weco/common/views/components/Layout12/Layout12';
import IIIFViewer from '@weco/common/views/components/IIIFViewer/IIIFViewer';
import BetaMessage from '@weco/common/views/components/BetaMessage/BetaMessage';
import Space from '@weco/common/views/components/styled/Space';

type Props = {|
  image: Image,
  sourceWork: Work,
  langCode: string,
|};

const ImagePage = ({ image, sourceWork, langCode }: Props) => {
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
      siteSection={'works'}
      imageUrl={'imageContentUrl'}
      imageAltText={''}
      hideNewsletterPromo={true}
      hideFooter={true}
      hideInfoBar={true}
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

ImagePage.getInitialProps = async (ctx: Context): Promise<Props> => {
  const { id, workId, langCode } = ctx.query;
  const { imagesEndpoint } = ctx.query.toggles;
  if (!id || !imagesEndpoint) {
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
    image,
    langCode,
    sourceWork: work,
  };
};

export default ImagePage;
