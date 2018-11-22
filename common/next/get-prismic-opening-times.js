const Prismic = require('prismic-javascript');

let openingTimes = {results: []};
async function getAndSetOpeningTimes() {
  try {
    const api = await Prismic.getApi('https://wellcomecollection.prismic.io/api/v2');
    openingTimes = await api.query([Prismic.Predicates.any('document.type', ['collection-venue'])]);
  } catch (e) {

  }
}

setInterval(getAndSetOpeningTimes, 6000);
module.exports = {getPrismicOpeningTimes: () => openingTimes};
