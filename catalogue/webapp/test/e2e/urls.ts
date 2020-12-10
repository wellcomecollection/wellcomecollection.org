export const baseUrl = (): string => {
  switch (process.env.NODE_ENV) {
    case 'production':
      return 'https://wellcomecollection.org';
    case 'staging':
      return 'https://www-stage.wellcomecollection.org';
    default:
      return `http://localhost:${process.env.PORT || 3000}`;
  }
};

export const collectionsUrl = `${baseUrl()}/collections`;
export const worksUrl = `${baseUrl()}/works`;
