import RSS from 'feed';
import {getDocumentsOfTypes} from '@weco/common/services/prismic/api';

const Feed = ({ articles }) => {
  const feed = new RSS({
    title: 'Wellcome Collection editorial',
    description: '',
    id: 'https://wellcomecollection.org',
    link: 'https://wellcomecollection.org/articles',
    image: 'https://i.wellcomecollection.org/assets/icons/apple-touch-icon.png',
    favicon: 'https://i.wellcomecollection.org/assets/icons/apple-touch-icon.png',
    copyright: 'Except where otherwise noted, content on this site is licensed under a Creative Commons Attribution 4.0 International Licence',
    updated: new Date(),
    feedLinks: {
      json: 'https://wellcomecollection.org/feed'
    },
    author: {
      name: 'Wellcome Collection'
    }
  });

  articles.results.forEach(article => {
    feed.addItem({
      title: article.data.title.text,
      description: article.data.promo[0].primary.caption.text,
      link: `https://wellcomecollection.org/articles/${article.id}`,
      date: new Date(article.last_publication_date)
    });
  });

  return feed.rss2();
};

Feed.getInitialProps = async (context) => {
  const {req} = context;
  const articleDocs = await getDocumentsOfTypes(req, ['articles']);
  return {articles: articleDocs};
};

export default Feed;
