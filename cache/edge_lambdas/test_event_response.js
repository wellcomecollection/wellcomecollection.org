module.exports = {
  Records: [
    {
      cf: {
        config: {
          distributionId: 'EXAMPLE',
        },
        request: {
          uri: '/',
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
                value: 'toggle_outro=true; toggle_noutro=false;',
              },
            ],
            'x-toggled': [
              {
                key: 'X-toggled',
                value: 'toggle_outro=true;',
              },
            ],
          },
        },
        response: {
          uri: '/articles/things',
          method: 'GET',
          clientIp: '2001:cdba::3257:9652',
          headers: {},
        },
      },
    },
  ],
};
