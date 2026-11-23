// A request goes to the v2 identity API when the identityApiV2 toggle is on
// and the patron is linked to FOLIO, or whenever the user is one Auth0 stores
// itself, since v1 can't serve them. Everyone else stays on v1.

import jwt from 'jsonwebtoken';
import { isIP } from 'net';
import type { NextApiRequest } from 'next';

import { getCachedToggles } from '@weco/common/server-data';
import { getTogglesFromContext } from '@weco/common/server-data/toggles';
import { getConfig } from '@weco/identity/config';

const config = getConfig();

// Put on the access token by the folio-sync Auth0 Action
export const folioUserIdClaim =
  'https://wellcomecollection.org/folio/folio_user_id';

export type IdentityApi = {
  version: 1 | 2;
  host: string;
  apiKey: string;
};

export const identityApiV1: IdentityApi = {
  version: 1,
  host: config.remoteApi.host,
  apiKey: config.remoteApi.apiKey,
};

export const identityApiV2: IdentityApi | undefined = config.remoteApiV2
  ? {
      version: 2,
      host: config.remoteApiV2.host,
      apiKey: config.remoteApiV2.apiKey,
    }
  : undefined;

export const isIdentityApiV2On = async (
  req: NextApiRequest
): Promise<boolean> => {
  const togglesResp = await getCachedToggles();
  const { featureFlags } = getTogglesFromContext(togglesResp, { req });
  return Boolean(featureFlags.identityApiV2);
};

export const folioUserIdFromAccessToken = (
  accessToken: string
): string | undefined => {
  const payload = jwt.decode(accessToken);
  const folioUserId =
    payload && typeof payload === 'object'
      ? payload[folioUserIdClaim]
      : undefined;
  return typeof folioUserId === 'string' && folioUserId
    ? folioUserId
    : undefined;
};

export const subFromAccessToken = (accessToken: string): string | undefined => {
  const payload = jwt.decode(accessToken);
  return payload && typeof payload === 'object' ? payload.sub : undefined;
};

// Users Auth0 stores itself, such as signups after the cutover, have a 24
// character hex ID rather than `p` and a Sierra patron number. v1 can't serve
// them, so they can only use their account through v2.
export const isAuth0StoredUser = (sub: string | undefined): boolean =>
  /^auth0\|[a-f0-9]{24}$/.test(sub ?? '');

export const chooseIdentityApi = async (
  req: NextApiRequest,
  folioUserId: string | undefined,
  sub: string | undefined
): Promise<IdentityApi> => {
  if (!identityApiV2) return identityApiV1;
  if (isAuth0StoredUser(sub)) return identityApiV2;
  return folioUserId && (await isIdentityApiV2On(req))
    ? identityApiV2
    : identityApiV1;
};

// For v2's password checks. CloudFront-Viewer-Address is "address:port"; an
// incoming X-Forwarded-For isn't trusted, since the browser can set it.
// Anything that isn't a single valid address is dropped, so v2 refuses the
// request rather than trusting it. There's no CloudFront locally, so
// development uses the connection's address.
export const patronIp = (req: NextApiRequest): string | undefined => {
  const viewerAddress = req.headers['cloudfront-viewer-address'];
  let address: string | undefined;
  if (typeof viewerAddress === 'string') {
    const portSeparator = viewerAddress.lastIndexOf(':');
    if (portSeparator > 0) address = viewerAddress.slice(0, portSeparator);
  } else if (process.env.NODE_ENV === 'development') {
    address = req.socket?.remoteAddress;
  }
  return address && isIP(address) ? address : undefined;
};
