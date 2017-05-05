// @flow
import Prismic from 'prismic.io';

export const getFlags = async () => {
  const api = await Prismic.api('http://wellcomecollection.prismic.io/api');
  const flags = await api.query(Prismic.Predicates.at('document.type', 'feature-flag'));
  return flags;
};
