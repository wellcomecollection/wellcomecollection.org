export const baseUrl: string = ((env: string) => {
  switch (env) {
    case 'production':
      return 'https://wellcomecollection.org';
    case 'staging':
      return 'https://www-stage.wellcomecollection.org';
    default:
      return 'http://localhost:3000';
  }
})(process.env.NODE_ENV);

export const worksUrl = `${baseUrl}/works`;
export const imagesUrl = `${baseUrl}/images`;
