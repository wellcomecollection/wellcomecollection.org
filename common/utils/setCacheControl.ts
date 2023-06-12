import { ServerResponse } from 'http';

export const setCacheControl = (res: ServerResponse) => {
  /**
   * Cloudfront should handle our caching, and the intention of this line is to
   * remove the caching that next adds on top of the request/responses.
   *
   * CloudFront behaviour:
   * https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/Expiration.html#w371aac17c17c25b9
   * Our cache policies:
   * https://github.com/wellcomecollection/wellcomecollection.org/blob/main/cache/modules/cloudfront_policies/cache_policies.tf
   */
  res.setHeader('Cache-Control', 'max-age=3600');
};
