import { NextApiRequest, NextApiResponse } from 'next';

import { getCachedToggles } from '@weco/common/server-data';
import { getTogglesFromContext } from '@weco/common/server-data/toggles';
import { isString, isUndefined } from '@weco/common/utils/type-guards';
import {
  globalApiOptions,
  GlobalApiOptions,
  rootUris,
  WellcomeApiError,
  wellcomeApiError,
} from '@weco/content/services/wellcome';
import { looksLikeCanonicalId } from '@weco/content/services/wellcome/catalogue';
import { ItemsList } from '@weco/content/services/wellcome/catalogue/types';

function getApiUrl(apiOptions: GlobalApiOptions, workId: string): string {
  return `${rootUris[apiOptions.env.catalogue]}/catalogue/v2/works/${workId}/items`;
}

function getApiKey(apiOptions: GlobalApiOptions): string {
  const key =
    apiOptions.env.catalogue === 'stage'
      ? process.env.items_api_key_stage
      : process.env.items_api_key_prod;

  if (isUndefined(key)) {
    console.warn('No API key provided for items API!');
    return '';
  }
  return key;
}

async function fetchWorkItems({
  workId,
  shouldUseStagingApi,
}: {
  workId: string;
  shouldUseStagingApi?: boolean;
}): Promise<ItemsList | WellcomeApiError> {
  const apiOptions = globalApiOptions(shouldUseStagingApi);
  const apiUrl = getApiUrl(apiOptions, workId);
  try {
    const items = await fetch(apiUrl, {
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': getApiKey(apiOptions) || '',
      },
    }).then(resp => resp.json());
    return items;
  } catch {
    return wellcomeApiError();
  }
}

const ItemsApi = async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> => {
  const togglesResp = await getCachedToggles();
  const { featureFlags } = getTogglesFromContext(togglesResp, { req });
  const { workId } = req.query;

  if (!isString(workId) || !looksLikeCanonicalId(workId)) {
    res.status(404);
    return;
  }
  const response = await fetchWorkItems({
    shouldUseStagingApi: featureFlags.stagingApi,
    workId,
  });
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
  // we are forcing revalidation at all times because this is to do with item availability, so it must be up to date
  res.setHeader(
    'Cache-Control',
    'private, no-cache, no-store, max-age=0, must-revalidate'
  );

  if (response.type === 'Error') {
    res.status(response.httpStatus);
  } else {
    res.status(200);
  }
  res.json(response);
};

export default ItemsApi;
