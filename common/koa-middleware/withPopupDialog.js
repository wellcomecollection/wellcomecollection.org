const Prismic = require('prismic-javascript');

let popupDialog = {
  openButtonText: null,
  dialogHeading: null,
  dialogCopy: [{ type: 'paragraph', text: null, spans: null }],
  ctaText: null,
  ctaLink: { url: null },
  isShown: false,
};

async function getAndSetPopupDialog() {
  try {
    const api = await Prismic.getApi(
      'https://wellcomecollection.prismic.io/api/v2'
    );
    const document = await api.getSingle('popup-dialog');

    popupDialog = document.data;
  } catch (e) {
    // TODO: Sentry?
  }
}
setInterval(getAndSetPopupDialog, 60000);

module.exports = function withPopupDialog(ctx, next) {
  ctx.popupDialog = popupDialog;
  return next();
};
