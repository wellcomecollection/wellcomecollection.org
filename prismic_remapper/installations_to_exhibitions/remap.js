// We no longer need the description as we now render the body, which is richer,
// and more able at conveying what content we have to offer.

module.exports = {
  filter({ filename, doc }) {
    return doc.type === 'installations';
  },
  map({ filename, doc }) {
    doc.type = 'exhibitions';
    doc.tags = doc.tags.concat(['delist']);
    // we change the filename as we don't want to override the existing content,
    // And that is where the ID is stored
    return { doc, filename: `new_${filename}` };
  },
};
