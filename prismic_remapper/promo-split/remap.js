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
