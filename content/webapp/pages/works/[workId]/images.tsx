import { FunctionComponent } from 'react';
import { GetServerSideProps } from 'next';
import { appError, AppErrorProps } from '@weco/common/services/app';
import {
  Work,
  Image,
  WorkBasic,
  toWorkBasic,
} from '@weco/catalogue/services/wellcome/catalogue/types';
import CataloguePageLayout from '@weco/catalogue/components/CataloguePageLayout/CataloguePageLayout';
import Layout12 from '@weco/common/views/components/Layout12/Layout12';
import BetaMessage from '@weco/common/views/components/BetaMessage/BetaMessage';
import Space from '@weco/common/views/components/styled/Space';
import IIIFViewer from '@weco/content/components/IIIFViewer';
import { serialiseProps } from '@weco/common/utils/json';
import { getWork } from '@weco/content/services/wellcome/catalogue/works';
import { getImage } from '@weco/content/services/wellcome/catalogue/images';
import { getServerData } from '@weco/common/server-data';
import { unavailableImageMessage } from '@weco/common/data/microcopy';
import { Pageview } from '@weco/common/services/conversion/track';
import { looksLikeCanonicalId } from '@weco/content/services/wellcome/catalogue';
import {
  ApiToolbarLink,
  setTzitzitParams,
} from '@weco/common/views/components/ApiToolbar';
import { setCacheControl } from '@weco/common/utils/setCacheControl';
import { getDigitalLocationOfType } from '@weco/catalogue/utils/works';
import { DigitalLocation } from '@weco/common/model/catalogue';
import { isNotUndefined } from '@weco/common/utils/type-guards';

function createTzitzitImageLink(
  work: Work,
  image: Image
): ApiToolbarLink | undefined {
  return setTzitzitParams({
    title: image.source.title,
    sourceLink: `https://wellcomecollection.org/works/${work.id}/images?id=${image.id}`,
    licence: image.locations[0].license,
    contributors: work.contributors,
  });
}

type Props = {
  image: Image;
  work: WorkBasic;
  iiifImageLocation?: DigitalLocation;
  iiifPresentationLocation?: DigitalLocation;
  apiToolbarLinks: ApiToolbarLink[];
  pageview: Pageview;
};

const ImagePage: FunctionComponent<Props> = ({
  image,
  work,
  iiifImageLocation,
  iiifPresentationLocation,
  apiToolbarLinks,
}) => {
  const title = work.title || '';

  return (
    <CataloguePageLayout
      title={title}
      description={''}
      url={{
        pathname: `/works/${work.id}/images`,
        query: { id: image.id },
      }}
      openGraphType="website"
      jsonLd={{ '@type': 'WebPage' }}
      siteSection="collections"
      apiToolbarLinks={apiToolbarLinks}
      hideNewsletterPromo={true}
      hideFooter={true}
      hideTopContent={true}
    >
      {iiifImageLocation ? (
        <IIIFViewer
          work={work}
          iiifImageLocation={iiifImageLocation}
          iiifPresentationLocation={iiifPresentationLocation}
          searchResults={null}
          setSearchResults={() => null}
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

export const getServerSideProps: GetServerSideProps<
  Props | AppErrorProps
> = async context => {
  setCacheControl(context.res);
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

  const iiifImageLocation =
    image.locations[0] || getDigitalLocationOfType(work, 'iiif-image');
  const iiifPresentationLocation = getDigitalLocationOfType(
    work,
    'iiif-presentation'
  );

  return {
    props: serialiseProps({
      image,
      work: toWorkBasic(work),
      iiifImageLocation,
      iiifPresentationLocation,
      // We know we'll get a catalogue API URL for a non-error response, but
      // this isn't (currently) asserted by the type system.
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      apiToolbarLinks: [
        {
          id: 'json',
          label: 'JSON',
          link: catalogueApiUrl!,
        },
        createTzitzitImageLink(work, image),
      ].filter(isNotUndefined),
      pageview: {
        name: 'image',
        properties: {},
      },
      serverData,
    }),
  };
};

export default ImagePage;
