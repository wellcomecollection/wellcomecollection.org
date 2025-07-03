import { Manifest } from '@iiif/presentation-3';
import { GetServerSideProps, NextPage } from 'next';

import {
  DigitalLocation,
  isDigitalLocation,
} from '@weco/common/model/catalogue';
import { getServerData } from '@weco/common/server-data';
import { SimplifiedServerData } from '@weco/common/server-data/types';
import { appError, AppErrorProps } from '@weco/common/services/app';
import { Pageview } from '@weco/common/services/conversion/track';
import { serialiseProps } from '@weco/common/utils/json';
import { isNotUndefined } from '@weco/common/utils/type-guards';
import {
  ApiToolbarLink,
  setTzitzitParams,
} from '@weco/common/views/components/ApiToolbar';
import { fromQuery } from '@weco/content/components/ItemLink';
import { fetchCanvasOcr } from '@weco/content/services/iiif/fetch/canvasOcr';
import { fetchIIIFPresentationManifest } from '@weco/content/services/iiif/fetch/manifest';
import { transformCanvasOcr } from '@weco/content/services/iiif/transformers/canvasOcr';
import { transformManifest } from '@weco/content/services/iiif/transformers/manifest';
import { looksLikeCanonicalId } from '@weco/content/services/wellcome/catalogue';
import {
  toWorkBasic,
  Work,
  WorkBasic,
} from '@weco/content/services/wellcome/catalogue/types';
import { getWork } from '@weco/content/services/wellcome/catalogue/works';
import { toCompressedTransformedManifest } from '@weco/content/types/compressed-manifest';
import { TransformedManifest } from '@weco/content/types/manifest';
import { fetchJson } from '@weco/content/utils/http';
import { getCollectionManifests } from '@weco/content/utils/iiif/v3';
import { setCacheControl } from '@weco/content/utils/setCacheControl';
import { getDigitalLocationOfType } from '@weco/content/utils/works';
import { queryParamToArrayIndex } from '@weco/content/views/works/work/IIIFViewer';
import WorkItemPage, {
  Props as WorkItemPageProps,
} from '@weco/content/views/works/work/items';

// Note: the `description` field on works can be large, which is why we omit it
// from the standard WorkBasic model.  We include it here because we use it for
// alt text in the IIIFViewer component, but we don't want it in other places
// where we use WorkBasic.
type WorkWithDescription = WorkBasic & {
  description?: string | null | undefined;
};

type Props = WorkItemPageProps & {
  work: WorkWithDescription;
  pageview: Pageview;
  serverData: SimplifiedServerData; // TODO should we enforce this?
};

const Page: NextPage<WorkItemPageProps> = props => {
  return <WorkItemPage {...props} />;
};

async function getParentManifest(
  parentManifestUrl: string | undefined
): Promise<Manifest | undefined> {
  try {
    return parentManifestUrl && (await fetchJson(parentManifestUrl));
  } catch (error) {
    return undefined;
  }
}

function createTzitzitWorkLink(work: Work): ApiToolbarLink | undefined {
  // Look at digital item locations only
  const digitalLocation: DigitalLocation | undefined = work.items
    ?.map(item => item.locations.find(isDigitalLocation))
    .find(i => i);

  return setTzitzitParams({
    title: work.title,
    sourceLink: `https://wellcomecollection.org/works/${work.id}/items`,
    licence: digitalLocation?.license,
    contributors: work.contributors,
  });
}

export const getServerSideProps: GetServerSideProps<
  Props | AppErrorProps
> = async context => {
  setCacheControl(context.res);
  const serverData = await getServerData(context);
  const { canvas = 1, manifest = 1 } = fromQuery(context.query);

  if (!looksLikeCanonicalId(context.query.workId)) {
    return { notFound: true };
  }

  const pageview: Pageview = {
    name: 'item',
    properties: {},
  };

  const work = await getWork({
    id: context.query.workId,
    toggles: serverData.toggles,
    include: ['items', 'languages', 'contributors', 'production', 'notes'],
  });

  if (work.type === 'Error') {
    return appError(context, work.httpStatus, work.description);
  }

  if (work.type === 'Redirect') {
    // This ensures that any query parameters are preserved on redirect,
    // e.g. if you have a link to /works/$oldId/items?canvas=10, then
    // you'll go to /works/$newId/items?canvas=10
    const destination = isNotUndefined(context.req.url)
      ? context.req.url.replace(context.query.workId, work.redirectToId)
      : `/works/${work.redirectToId}/items`;

    return {
      redirect: {
        destination,
        permanent: work.status === 301,
      },
    };
  }

  const iiifImageLocation = getDigitalLocationOfType(work, 'iiif-image');
  const iiifPresentationLocation = getDigitalLocationOfType(
    work,
    'iiif-presentation'
  );
  const iiifManifest =
    iiifPresentationLocation &&
    (await fetchIIIFPresentationManifest({
      location: iiifPresentationLocation.url,
    }));

  const transformedManifest = iiifManifest && transformManifest(iiifManifest);

  const { isCollectionManifest, manifests } = { ...transformedManifest };
  // If the manifest is actually a Collection, .i.e. a manifest of manifests,
  // then we get the first child manifest and use the data from that
  // see: https://iiif.wellcomecollection.org/presentation/v2/b21293302
  // from: https://wellcomecollection.org/works/f6qp7m32/items
  async function getDisplayManifest(
    transformedManifest: TransformedManifest,
    manifestIndex: number
  ): Promise<TransformedManifest> {
    if (isCollectionManifest) {
      const selectedCollectionManifestLocation = manifests?.[manifestIndex]?.id;
      const selectedCollectionManifest = selectedCollectionManifestLocation
        ? await fetchIIIFPresentationManifest({
            location: selectedCollectionManifestLocation,
          })
        : undefined;
      const firstChildTransformedManifest =
        selectedCollectionManifest &&
        transformManifest(selectedCollectionManifest);
      return firstChildTransformedManifest || transformedManifest;
    } else {
      return transformedManifest;
    }
  }

  const apiToolbarLinks = [createTzitzitWorkLink(work)].filter(isNotUndefined);

  if (transformedManifest) {
    const displayManifest = await getDisplayManifest(
      transformedManifest,
      queryParamToArrayIndex(manifest)
    );

    const { canvases, parentManifestUrl } = displayManifest;

    const parentManifest = await getParentManifest(parentManifestUrl);

    const currentCanvas = canvases[queryParamToArrayIndex(canvas)];
    const canvasOcrText = await fetchCanvasOcr(currentCanvas);
    const canvasOcr = transformCanvasOcr(canvasOcrText);

    const getSearchResults = async () => {
      if (displayManifest.searchService && context.query?.query?.length) {
        try {
          return await (
            await fetch(
              `${displayManifest.searchService['@id']}?q=${context.query.query}`
            )
          ).json();
        } catch (error) {
          return undefined;
        }
      } else {
        return undefined;
      }
    };

    const serverSearchResults = await getSearchResults();

    return {
      props: serialiseProps<Props>({
        compressedTransformedManifest:
          toCompressedTransformedManifest(displayManifest),
        canvasOcr,
        canvas,
        iiifImageLocation,
        iiifPresentationLocation,
        apiToolbarLinks,
        pageview,
        serverData,
        serverSearchResults,
        work: {
          ...toWorkBasic(work),
          description: work.description, // See type comments above
        },
        // Note: the parentManifest data can be enormous; for /works/cf4mdjzg/items it's
        // over 12MB in size (!).
        //
        // We only use it to render the MultipleManifestList component in ViewerSidebar, and
        // that component isn't always displayed.  Replicating the `behaviour === 'multi-part'`
        // check here is an attempt to reduce the amount of unnecessary data we send on the
        // page, which we believe is hurting app performance in these pathological cases.
        parentManifest:
          parentManifest && parentManifest.behavior?.[0] === 'multi-part'
            ? {
                behavior: parentManifest.behavior,
                canvases: getCollectionManifests(parentManifest).map(
                  canvas => ({
                    id: canvas.id,
                    label: canvas.label,
                  })
                ),
              }
            : undefined,
      }),
    };
  }

  if (iiifImageLocation) {
    return {
      props: serialiseProps<Props>({
        compressedTransformedManifest: undefined,
        work: toWorkBasic(work),
        canvas,
        iiifImageLocation,
        iiifPresentationLocation,
        apiToolbarLinks,
        pageview,
        serverData,
        serverSearchResults: null,
      }),
    };
  }

  return {
    notFound: true,
  };
};

export default Page;
