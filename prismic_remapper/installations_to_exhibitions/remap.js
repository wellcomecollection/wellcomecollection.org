// We no longer need the description as we now render the body, which is richer,
// and more able at conveying what content we have to offer.

module.exports = {
  filter({ filename, doc }) {
    return doc.type === 'installations';
  },
  map({ filename, doc }) {
    doc.type = 'exhibitions';
    doc.tags = doc.tags.concat(['delist']);
    return { doc, filename };
  },
};
