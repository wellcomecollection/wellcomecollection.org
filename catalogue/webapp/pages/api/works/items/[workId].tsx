import { NextApiRequest, NextApiResponse } from 'next';
import { ItemsList, CatalogueApiError } from '@weco/common/model/catalogue';
import {
  catalogueApiError,
  rootUris,
  globalApiOptions,
  GlobalApiOptions,
} from '../../../../services/catalogue';
import { Toggles } from '@weco/toggles';
import { getTogglesFromContext } from '@weco/common/server-data/toggles';

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
}): Promise<ItemsList | CatalogueApiError> {
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
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> => {
  // As the only toggle we care about here for now is the stagingApi
  // this is a mega hack to get this working so we can remove toggles from the query
  // TODO : get toggles working here
  const togglesResp = {
    toggles: [
      {
        id: 'stagingApi',
        title: 'Staging API',
        defaultValue: false,
        description: 'Use the staging catalogue API',
      },
    ],
    tests: [],
  };
  const toggles = getTogglesFromContext(togglesResp, { req });
  const { workId } = req.query;
  const id = Array.isArray(workId) ? workId[0] : workId;
  const response = await fetchWorkItems({
    toggles,
    workId: id,
  });
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
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
