const https = require('https');

function get(uri, options) {
  return new Promise((resolve, reject) => {
    return https.get(uri, function(response) {
      // beware, mutants.
      var body = '';
      response.on('data', (d) => body += d);
      response.on('end', () => resolve(JSON.parse(body)));
      response.on('error', () => reject);
    });
  });
}

module.exports = {get};
