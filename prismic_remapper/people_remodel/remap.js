// people.twitterHandle has been deprecated in favour of the more generic people.sameAs

// some of the twitterHandles start with @; we don't want that
function removeAt(twitterHandle) {
  const twitterHandleStart = twitterHandle.charAt(0);
  if (twitterHandleStart === '@') {
    return twitterHandle.substr(1);
  } else {
    return twitterHandle;
  }
}
module.exports = {
  filter({filename, doc}) {
    return doc.type === 'people';
  },
  map({filename, doc}) {
    if (doc.twitterHandle) {
      const twitterHandle = removeAt(doc.twitterHandle);
      const twitterSameAs = [{
        link: `https://twitter.com/${twitterHandle}`,
        title: `@${twitterHandle}`
      }];
      if (doc.sameAs) {
        const currentTwitterSameAsIndex = doc.sameAs.findIndex(item => `https://twitter.com/${twitterHandle}` === item.link);
        if (currentTwitterSameAsIndex === -1) {
          doc.sameAs = doc.sameAs.concat(twitterSameAs).filter(item => Object.keys(item).length > 0);
        } else {
          doc.sameAs[currentTwitterSameAsIndex] = twitterSameAs; // some of the current sameAs objects with twitter links don't have the title, so we make sure they do
        }
      } else {
        doc.sameAs = twitterSameAs.filter(item => Object.keys(item).length > 0);
      }
    }
    delete doc.twitterHandle;
    return {doc, filename};
  }
};
