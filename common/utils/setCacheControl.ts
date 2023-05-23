import { ServerResponse } from 'http';

export const setCacheControl = (res: ServerResponse) => {
  /**
   * Cloudfront should handle our caching, and the intention of this line is to
   * remove the caching that next adds on top of the request/responses.
   */
  res.removeHeader('Cache-Control');
};
