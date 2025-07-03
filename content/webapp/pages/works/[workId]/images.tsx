import { FunctionComponent } from 'react';

import { getServerData } from '@weco/common/server-data';
import { appError } from '@weco/common/services/app';
import { serialiseProps } from '@weco/common/utils/json';
import { isNotUndefined } from '@weco/common/utils/type-guards';
import {
  ApiToolbarLink,
  setTzitzitParams,
} from '@weco/common/views/components/ApiToolbar';
import {
  ServerSideProps,
  ServerSidePropsOrAppError,
} from '@weco/common/views/pages/_app';
import { looksLikeCanonicalId } from '@weco/content/services/wellcome/catalogue';
import { getImage } from '@weco/content/services/wellcome/catalogue/images';
import {
  Image,
  toWorkBasic,
  Work,
} from '@weco/content/services/wellcome/catalogue/types';
import { getWork } from '@weco/content/services/wellcome/catalogue/works';
import { setCacheControl } from '@weco/content/utils/setCacheControl';
import { getDigitalLocationOfType } from '@weco/content/utils/works';
import WorkImagesPage, {
  Props as WorkImagesPageProps,
} from '@weco/content/views/works/work/images';

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

const ImagePage: FunctionComponent<WorkImagesPageProps> = props => {
  return <WorkImagesPage {...props} />;
};

type Props = ServerSideProps<WorkImagesPageProps>;

export const getServerSideProps: ServerSidePropsOrAppError<
  Props
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
    props: serialiseProps<Props>({
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
