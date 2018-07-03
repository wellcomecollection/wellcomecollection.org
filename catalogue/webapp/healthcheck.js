var request = require('requestretry');

request({
  url: 'http://localhost:3000/works',
  json: true,
  maxAttempts: 5,
  retryDelay: 5000,
  retryStrategy: request.RetryStrategies.HTTPOrNetworkError
}, function(err, response, body) {
  if (err) { console.error(err); process.exit(1); }
  if (response) {
    console.log('The number of request attempts: ' + response.attempts);
  }
});
