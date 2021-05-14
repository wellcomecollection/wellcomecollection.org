import fetch from 'isomorphic-unfetch';
import { NextApiRequest, NextApiResponse } from 'next';
import { ItemsWork, CatalogueApiError } from '@weco/common/model/catalogue';
import { catalogueApiError } from '../../../services/catalogue/common';
import hasOwnProperty from '@weco/common/utils/has-own-property';

export function isCatalogueApiError(
  response: ItemsWork | CatalogueApiError
): response is CatalogueApiError {
  return Boolean(hasOwnProperty(response, 'type') && response.type === 'Error');
}

async function fetchWorkItems(
  id: string
): Promise<ItemsWork | CatalogueApiError> {
  try {
    const items = await fetch(
      `https://api.wellcomecollection.org/catalogue/v2/works/${id}/items`,
      {
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': process.env.items_api_key || '',
        },
      }
    ).then(resp => resp.json());
    return items;
  } catch (error) {
    return catalogueApiError();
  }
}

export default async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> => {
  const { workId } = req.query;
  const id = Array.isArray(workId) ? workId[0] : workId;
  const response = await fetchWorkItems(id);
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (isCatalogueApiError(response)) {
    res.status(response.httpStatus);
  } else {
    res.status(200);
  }
  res.json(response);
};
