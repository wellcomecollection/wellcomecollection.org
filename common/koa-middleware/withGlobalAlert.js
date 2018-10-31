const Prismic = require('prismic-javascript');

let globalAlert = {
  text: [ { type: 'paragraph',
    text: null,
    spans: null } ],
  isShown: 'hide'
};
async function getAndSetGlobalAlert() {
  try {
    const api = await Prismic.getApi('https://wellcomecollection.prismic.io/api/v2');
    const document = await api.getSingle('global-alert');
    globalAlert = document.data;
  } catch (e) {
    // TODO: Alert to sentry
  }
}
setInterval(getAndSetGlobalAlert, 6000);
module.exports = function withGlobalAlert(ctx, next) {
  ctx.globalAlert = globalAlert;
  return next();
};
