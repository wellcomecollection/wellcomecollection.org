import fs from 'fs';
import mkdirp from 'mkdirp';
import rimraf from 'rimraf';
import Prismic from 'prismic-javascript';
import {exportPrismicArticles} from './services/export-prismic-articles';


// Get the prismic articles
export async function go() {
  // TODO: We could probably use less `await` and be more async
  const api = await Prismic.api('https://wellcomecollection.prismic.io/api');
  const articles = await exportPrismicArticles();
  const response = await api.query(new Prismic.Predicates.at('document.type', 'articles'), {pageSize: 1});
  const requests = new Array(response.total_pages - 1).fill().map((_, i) => {
    return api.query(new Prismic.Predicates.at('document.type', 'articles'), {pageSize: 1, page: i + 1});
  });
  const prismicResponses = await Promise.all(requests);
  const prismicArticles = [response].concat(prismicResponses).reduce((all, one) => {
    return all.concat(one.results);
  }, []);

  const articlesWithIds = articles.map(article => {
    const matchedPrismicArticle = prismicArticles.find(pa => pa.uid === article.uid);
    if (matchedPrismicArticle) {
      return Object.assign({}, articles, {id: matchedPrismicArticle.id});
    } else {
      return article;
    }
  });

  const dir = `${__dirname}/.prismic-export/`;
  rimraf.sync(dir);

  mkdirp(dir, () => {
    articlesWithIds.forEach(article => {
      console.info(`${dir}/${article.id || article.uid}.json`);
      fs.writeFile(`${dir}/${article.id || article.uid}.json`, JSON.stringify(article), err => {
        if (err) {
          console.error(err);
        }
      });
    });
  });
}
