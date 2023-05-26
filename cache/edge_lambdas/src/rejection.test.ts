import { CloudFrontRequestEvent } from 'aws-lambda';
import { looksLikeSpam } from './rejection';

describe('requests that probably aren’t spam', () => {
  test.each([
    { request: { uri: '/whats-on', querystring: '' } },
    { request: { uri: '/articles/YFS1qRAAACgAF3A3', querystring: '' } },
    {
      request: {
        querystring: 'query=history+of+play',
        headers: {
          'user-agent': [{ key: 'User-Agent', value: 'Chrome/103.0.5060.134' }],
        },
      },
    },
    {
      request: {
        querystring: 'query=生殖健康问题+Reproductive+health+matters',
      },
    },
    { request: { querystring: 'query=fish&page=2&workType=a' } },
  ])(`$request`, ({ request }) => {
    const event: CloudFrontRequestEvent = {
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
              uri: '/search',
              method: 'GET',
              clientIp: '2001:cdba::3257:9652',
              headers: {},
              ...request,
            },
          },
        },
      ],
    };

    expect(looksLikeSpam(event)).toBeFalsy();
  });
});

describe('requests that probably are spam', () => {
  test.each([
    { request: { querystring: 'ID=6xnq75u6n&query=找黑客' } },
    {
      request: {
        querystring: 'query=free+to+play+casino',
        headers: {
          'user-agent': [{ key: 'User-Agent', value: 'bingbot/2.0;' }],
        },
      },
    },
    {
      request: {
        querystring: 'query=来我们这里免费玩赌场游戏',
        headers: {
          'user-agent': [{ key: 'User-Agent', value: 'Googlebot/2.1;' }],
        },
      },
    },
    {
      request: {
        querystring:
          'query=不用认真来找我们免费玩赌场游戏sketchy.xyz我们拥有所有最好的骗局和垃圾邮件我们非常值得信赖您可以完全关闭病毒检查程序',
      },
    },
  ])(`$request`, ({ request }) => {
    const event: CloudFrontRequestEvent = {
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
              uri: '/search',
              method: 'GET',
              clientIp: '2001:cdba::3257:9652',
              headers: {},
              ...request,
            },
          },
        },
      ],
    };

    expect(looksLikeSpam(event)).toBeTruthy();
  });
});
