import { ServerResponse } from 'http';

export const cacheTTL = {
  default: 3600, // 1 hour
  search: 300, // 5 minutes
  events: 60, // 1 minute
} as const;

export const setCacheControl = (
  res: ServerResponse,
  ttl: (typeof cacheTTL)[keyof typeof cacheTTL] = cacheTTL.default
) => {
  /**
   * Cloudfront should handle our caching, and the intention of this line is to
   * remove the caching that next adds on top of the request/responses.
   *
   * CloudFront behaviour:
   * https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/Expiration.html#w371aac17c17c25b9
   * Our cache policies:
   * https://github.com/wellcomecollection/wellcomecollection.org/blob/main/cache/modules/cloudfront_policies/cache_policies.tf
   */
  res.setHeader('Cache-Control', `max-age=${ttl}`);

  /**
   * Response content depends on toggle_* and other cookies (see
   * common/server-data/toggles.ts), but browsers cache HTTP responses per-URL
   * regardless of cookies unless told otherwise. Without this, a browser can
   * serve a locally cached response for a URL that was fetched under a
   * different cookie state (e.g. a different feature toggle value), even
   * though CloudFront's own cache is correctly keyed on those cookies.
   */
  res.setHeader('Vary', 'Cookie');
};
