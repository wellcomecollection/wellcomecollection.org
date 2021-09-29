const fetch = require('isomorphic-unfetch');
const fs = require('fs-extra');
const path = require('path');
const Prismic = require('prismic-javascript');

const fetchers = {
  toggles: async () => {
    const data = await fetch(
      'https://toggles.wellcomecollection.org/toggles.json'
    ).then(resp => resp.json());
    return data;
  },
  openingTimes: async () => {
    const api = await Prismic.getApi(
      'https://wellcomecollection.cdn.prismic.io/api/v2'
    );
    const data = await api.query([
      Prismic.Predicates.any('document.type', ['collection-venue']),
    ]);

    return data;
  },
};

const writeCache = async () => {
  const writes = Object.entries(fetchers).map(async ([key, fetcher]) => {
    const data = await fetcher();
    const cacheDir = path.resolve(__dirname, '.cache');

    fs.ensureDir(cacheDir).then(() =>
      fs.writeJson(`${cacheDir}/${key}.json`, data)
    );
  });

  await Promise.all(writes);
};

const writeCacheOnInterval = async (interval = 60 * 1000) => {
  await writeCache();
  setInterval(writeCache, interval);
};

module.exports = { writeCacheOnInterval, fetchers };
