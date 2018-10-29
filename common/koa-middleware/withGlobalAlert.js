const Prismic = require('prismic-javascript');

let globalAlert = {isShow: false, text: null};
async function getAndSetGlobalAlert() {
  try {
    const api = await Prismic.getApi('https://wellcomecollection.prismic.io/api/v2');
    const document = await api.getSingle('global-alert');
    globalAlert = {
      text: document.data.text,
      isShown: document.data.isShown && document.data.isShown === 'show'
    };
  } catch (e) {
    // TODO: Alert to sentry
  }
}
setInterval(getAndSetGlobalAlert, 6000);
module.exports = function withGlobalAlert(ctx, next) {
  ctx.globalAlert = globalAlert;
  return next();
};
