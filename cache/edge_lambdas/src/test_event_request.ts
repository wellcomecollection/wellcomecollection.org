import { CloudFrontRequestEvent } from 'aws-lambda';

const request: CloudFrontRequestEvent = {
  Records: [
    {
      cf: {
        config: {
          distributionId: 'EXAMPLE',
          distributionDomainName: '',
          requestId: '',
          eventType: 'origin-request',
        },
        request: {
          uri: '/articles/things',
          querystring: '',
          method: 'GET',
          clientIp: '2001:cdba::3257:9652',
          headers: {
            'user-agent': [
              {
                key: 'User-Agent',
                value: 'Test Agent',
              },
            ],
            host: [
              {
                key: 'Host',
                value: 'd123.cf.net',
              },
            ],
            cookie: [
              {
                key: 'Cookie',
                value: 'toggle_noutro=false; nothingtodowiththis=10',
              },
            ],
          },
        },
      },
    },
  ],
};

export default request;
