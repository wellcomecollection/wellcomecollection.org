// Types for the CloudFront Functions runtime (cloudfront-js-2.0). They're
// ambient, so the functions can use them without importing anything at runtime.

declare module 'cloudfront' {
  type KeyValueStore = {
    get(
      key: string,
      options?: { format?: 'string' | 'json' | 'bytes' }
    ): Promise<unknown>;
  };
  const cf: { kvs(id?: string): KeyValueStore };
  export default cf;
}

type CloudFrontValue = { value: string; multiValue?: CloudFrontValue[] };

type CloudFrontRequest = {
  method: string;
  uri: string;
  querystring: Record<string, CloudFrontValue>;
  headers: Record<string, CloudFrontValue>;
  cookies: Record<string, CloudFrontValue>;
};

type CloudFrontResponse = {
  statusCode: number;
  headers: Record<string, CloudFrontValue>;
  cookies: Record<string, { value: string; attributes?: string }>;
};

type CloudFrontRequestEvent = { request: CloudFrontRequest };

type CloudFrontResponseEvent = {
  request: CloudFrontRequest;
  response: CloudFrontResponse;
};
