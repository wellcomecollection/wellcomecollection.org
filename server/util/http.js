const http = require('http');

function get(uri, options) {
  return new Promise((resolve, reject) => {
    return http.get(uri, function(response) {
      // beware, mutants.
      var body = '';
      response.on('data', (d) => body += d);
      response.on('end', () => resolve(JSON.parse(body)));
      response.on('error', () => reject);
    });
  });
}

module.exports = {get};
