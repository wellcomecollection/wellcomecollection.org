import fetch from 'isomorphic-unfetch';
import { NextApiResponse } from 'next';
import { ItemsWork, CatalogueApiError } from '@weco/common/model/catalogue';
import {
  catalogueApiError,
  rootUris,
  globalApiOptions,
  GlobalApiOptions,
} from '../../../services/catalogue/common';
import hasOwnProperty from '@weco/common/utils/has-own-property';
import { Toggles } from '@weco/toggles';
import withToggles, {
  NextApiRequestWithToggles,
} from '@weco/common/api-routes-middleware/withToggles';

export function isCatalogueApiError(
  response: ItemsWork | CatalogueApiError
): response is CatalogueApiError {
  return Boolean(hasOwnProperty(response, 'type') && response.type === 'Error');
}

function getApiUrl(apiOptions: GlobalApiOptions, workId: string): string {
  return `${rootUris[apiOptions.env]}/v2/works/${workId}/items`;
}

function getApiKey(apiOptions: GlobalApiOptions): string {
  if (apiOptions.env === 'stage') {
    return process.env.items_api_key_stage;
  } else {
    return process.env.items_api_key_prod;
  }
}

async function fetchWorkItems({
  workId,
  toggles,
}: {
  workId: string;
  toggles: Toggles;
}): Promise<ItemsWork | CatalogueApiError> {
  const apiOptions = globalApiOptions(toggles);
  const apiUrl = getApiUrl(apiOptions, workId);
  try {
    const items = await fetch(apiUrl, {
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': getApiKey(apiOptions) || '',
      },
    }).then(resp => resp.json());
    return items;
  } catch (error) {
    return catalogueApiError();
  }
}

const ItemsApi = async (
  req: NextApiRequestWithToggles,
  res: NextApiResponse
): Promise<void> => {
  const { workId } = req.query;
  const toggles = req.toggles;
  const id = Array.isArray(workId) ? workId[0] : workId;
  const response = await fetchWorkItems({
    toggles,
    workId: id,
  });
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (isCatalogueApiError(response)) {
    res.status(response.httpStatus);
  } else {
    res.status(200);
  }
  res.json(response);
};

export default withToggles(ItemsApi);
