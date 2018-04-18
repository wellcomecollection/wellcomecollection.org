// Accessing the promo of linked content is impossible at the moment as you
// can't query `fetchLinks` on Slices. This splits the promo out into
// `promoText` And promoImage, which you can both fetch with `fetchLinks`

module.exports = {
  filter: ({filename, doc}) => {
    return doc.type === 'exhibitions';
  },
  map: ({filename, doc}) => {
    if (doc.promo.length === 0) {
      return doc;
    }
    const val = doc.promo[0].value['non-repeat'];
    return {
      filename,
      doc: {
        ...doc,
        promoImage: val.image,
        promoText: val.caption
      }
    };
  }
};
