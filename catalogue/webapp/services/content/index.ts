import { Toggles } from '@weco/toggles';

import fetch, { Response } from 'node-fetch';
import { HttpsAgent as Agent } from 'agentkeepalive';
import {
  ContentApiError,
  ContentResultsList,
} from '@weco/catalogue/services/content/types';
import { propsToQuery } from '@weco/common/utils/routes';
import { Content } from './types/api';

const rootUris = {
  prod: 'https://api.wellcomecollection.org/content',
  stage: 'https://api-stage.wellcomecollection.org/content',
};

type GlobalApiOptions = {
  env: 'prod' | 'stage';
  index?: string;
};

const globalApiOptions = (toggles?: Toggles): GlobalApiOptions => ({
  env: toggles?.stagingApi ? 'stage' : 'prod',
});

const contentApiError = (): ContentApiError => ({
  errorType: 'http',
  httpStatus: 500,
  label: 'Internal Server Error',
  description: '',
  type: 'Error',
});

// By default, the next.js polyfill for node-fetch enables keep-alive by default.
// https://nextjs.org/docs/api-reference/next.config.js/disabling-http-keep-alive
//
// This is great, but it leads us occasionally to see errors like this one:
//
//      FetchError: request to https://api.wellcomecollection.org/catalogue/v2/works/...
//      failed, reason: read ECONNRESET
//
// That's because the (client) HTTP agent is keeping the socket open indefinitely, but
// the server has other ideas:
//
// - default "idle-timeout" in akka-http is 60s https://doc.akka.io/docs/akka-http/current/configuration.html
// - NLBs have a fixed idle timeout of 350s https://docs.aws.amazon.com/elasticloadbalancing/latest/network/network-load-balancers.html#connection-idle-timeout
//
// As such, we use an agent which is configured to expire free sockets after 59s
// A good explanation of the problem, as well as the solution, is available here:
// https://connectreport.com/blog/tuning-http-keep-alive-in-node-js/
const agentKeepAlive = new Agent({
  keepAlive: true,
  freeSocketTimeout: 1000 * 59, // 1s less than the akka-http idle timeout
});

const contentFetch = (
  url: string,
  options?: Record<string, string>
): Promise<Response> => {
  return fetch(url, { ...options, agent: agentKeepAlive });
};

export type QueryProps<Params> = {
  params: Params;
  pageSize?: number;
  toggles: Toggles;
};

export async function contentQuery<Params>(
  endpoint: string,
  { params, toggles, pageSize }: QueryProps<Params>
): Promise<ContentResultsList<Content> | ContentApiError> {
  const apiOptions = globalApiOptions(toggles);
  const extendedParams = {
    ...params,
    pageSize,
  };

  const searchParams = new URLSearchParams(
    propsToQuery(extendedParams)
  ).toString();

  const url = `${rootUris[apiOptions.env]}/v0/${endpoint}?${searchParams}`;

  try {
    const res = await contentFetch(url);
    const json = await res.json();

    // In general we want to know about errors from the content API, but
    // HTTP 414 URI Too Long isn't interesting -- it's usually a sign of an
    // automated tool trying to inject malicious data, and thus can be ignored.
    if (json.type === 'Error' && json.httpStatus !== 414) {
      console.warn(
        `Received HTTP ${json.httpStatus} error from content API query ${url}: ` +
          JSON.stringify(json)
      );
    }

    return {
      ...json,
      _requestUrl: url,
    };
  } catch (error) {
    console.error(`Unable to fetch content API URL ${url}`, error);
    return contentApiError();
  }
}
