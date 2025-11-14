import { promises as fs } from 'fs';
import { NextApiRequest, NextApiResponse } from 'next';
import * as path from 'path';

import togglesHandler, {
  getTogglesFromContext,
} from '@weco/common/server-data/toggles';
import { isString } from '@weco/common/utils/type-guards';
import {
  globalApiOptions,
  rootUris,
  WellcomeApiError,
  wellcomeApiError,
} from '@weco/content/services/wellcome';
import {
  Addressable,
  Article,
  ContentResultsList,
} from '@weco/content/services/wellcome/content/types/api';
import { Toggles, TogglesResp } from '@weco/toggles';

async function fetchArticlesByWork({
  workId,
  toggles,
}: {
  workId: string;
  toggles: Toggles;
}): Promise<ContentResultsList<Addressable | Article> | WellcomeApiError> {
  const apiOptions = globalApiOptions(toggles);
  const apiUrl = `${rootUris[apiOptions.env.content]}/content/v0/articles?linkedWork=${workId}`;

  try {
    const response = await fetch(apiUrl, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching articles by work:', error);
    return wellcomeApiError();
  }
}

const StoriesByWorkApi = async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> => {
  // Try to read cached server-data toggles (written by common/server-data)
  // Fallback to the toggles handler default if the file isn't present
  let togglesResp: TogglesResp = togglesHandler.defaultValue;
  try {
    const serverDataPath = path.join(
      process.cwd(),
      '.server-data',
      'toggles.json'
    );
    const raw = await fs.readFile(serverDataPath, { encoding: 'utf-8' });
    togglesResp = JSON.parse(raw) as TogglesResp;
  } catch (e) {
    // If reading cached server-data fails, fall back to the default toggles
    // (this keeps behavior consistent and avoids making a remote fetch per-request)
  }

  const toggles = getTogglesFromContext(togglesResp, { req });
  const { workId } = req.query;

  if (!isString(workId)) {
    res.status(400).json({ error: 'Invalid workId parameter' });
    return;
  }

  const response = await fetchArticlesByWork({
    toggles,
    workId,
  });

  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader(
    'Cache-Control',
    'public, s-maxage=43200, stale-while-revalidate=43200'
  );

  if (response.type === 'Error') {
    res.status(response.httpStatus);
  } else {
    res.status(200);
  }
  res.json(response);
};

export default StoriesByWorkApi;
