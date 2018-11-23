const Prismic = require('prismic-javascript');
let collectionVenues = {results: []};
async function getAndSetCollectionVenues() {
  try {
    const api = await Prismic.getApi('https://wellcomecollection.prismic.io/api/v2');
    collectionVenues = await api.query([
      Prismic.Predicates.any('document.type', ['collection-venue'])
    ]);
  } catch (e) {
  }
}
setInterval(getAndSetCollectionVenues, 6000);
module.exports = {getPrismicCollectionVenues: () => collectionVenues};
