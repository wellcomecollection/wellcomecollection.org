// We no longer need the description as we now render the body, which is richer,
// and more able at conveying what content we have to offer.

module.exports = {
  filter({filename, doc}) {
    return doc.type === 'events';
  },
  map({filename, doc}) {
    const body = [{
      key: 'text',
      value: {
        'non-repeat': {
          text: doc.description
        }
      }
    }];

    if (!doc.body) {
      doc.body = body;
    };

    return {doc, filename};
  }
};
