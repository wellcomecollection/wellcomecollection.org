import { GetServerSideProps } from 'next';
import { FunctionComponent } from 'react';

import { unavailableContentMessage } from '@weco/common/data/microcopy';
import { DigitalLocation } from '@weco/common/model/catalogue';
import { getServerData } from '@weco/common/server-data';
import { appError, AppErrorProps } from '@weco/common/services/app';
import { Pageview } from '@weco/common/services/conversion/track';
import { serialiseProps } from '@weco/common/utils/json';
import { isNotUndefined } from '@weco/common/utils/type-guards';
import {
  ApiToolbarLink,
  setTzitzitParams,
} from '@weco/common/views/components/ApiToolbar';
import {
  ContaineredLayout,
  gridSize12,
} from '@weco/common/views/components/Layout';
import Space from '@weco/common/views/components/styled/Space';
import BetaMessage from '@weco/content/components/BetaMessage';
import CataloguePageLayout from '@weco/content/components/CataloguePageLayout';
import IIIFViewer from '@weco/content/components/IIIFViewer';
import { looksLikeCanonicalId } from '@weco/content/services/wellcome/catalogue';
import { getImage } from '@weco/content/services/wellcome/catalogue/images';
import {
  Image,
  toWorkBasic,
  Work,
  WorkBasic,
} from '@weco/content/services/wellcome/catalogue/types';
import { getWork } from '@weco/content/services/wellcome/catalogue/works';
import { setCacheControl } from '@weco/content/utils/setCacheControl';
import { getDigitalLocationOfType } from '@weco/content/utils/works';

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
      description=""
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
        <ContaineredLayout gridSizes={gridSize12()}>
          <Space $v={{ size: 'l', properties: ['margin-bottom'] }}>
            <div style={{ marginTop: '98px' }}>
              <BetaMessage message={unavailableContentMessage} />
            </div>
          </Space>
        </ContaineredLayout>
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

      apiToolbarLinks: [
        {
          id: 'json',
          label: 'JSON',

          link: catalogueApiUrl!,
        },
        createTzitzitImageLink(work, image),
        {
          id: 'library-data-link-explorer',
          label: 'Library Data Link Explorer',
          ariaLabel: 'open matcher graph via the Library Data Link Explorer',
          link: `https://main.d33vyuqnhij7au.amplifyapp.com/?workId=${work.id}`,
        },
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
