const browserstackLocal = require('browserstack-local');
const browserstack = require('browserstack');
const open = require('open');
const testBrowsers = require('./test-browsers.json');
const url = process.argv[2];
const user = process.env.BROWSERSTACK_USERNAME;
const key = process.env.BROWSERSTACK_KEY;
const settings = {
  "local": true,
  "url": url,
  "wait_time": "10",
  "browsers": testBrowsers
}
const bs_local = new browserstackLocal.Local();
const screenshotClient = browserstack.createScreenshotClient({
    "username": user,
    "password": key
});
const quitBrowserstackLocal = (job_id) => {
  (function checkStatus() {
    screenshotClient.getJob(job_id, (error, job) => {
      if(error) {
        return console.error(error);
      }
      if(job.state === 'done'){
        console.info('Screenshots have been taken and can be viewed at https://www.browserstack.com/screenshots');
        bs_local.stop(() => {
          console.info("BrowserStackLocal has been stopped");
        });
      } else {
        setTimeout(checkStatus, 2000);
      }
    });
  })();
}

if (url === undefined) {
  console.info('You need to specify a url');
} else {
  bs_local.start({'key': key, 'binarypath': './browserstack/BrowserStackLocal', 'force': 'true'}, () => {
    screenshotClient.generateScreenshots(settings, (error, job) => {
      if(error) {
        return console.error(error);
      }
      open("https://www.browserstack.com/screenshots");
      quitBrowserstackLocal(job.job_id);
    });
  });
}
