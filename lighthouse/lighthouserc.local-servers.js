const startCatalogue = 'PORT=3000 yarn workspace @weco/catalogue run start';
const startContent = 'PORT=3001 yarn workspace @weco/content run start';

module.exports = {
  ci: {
    collect: {
      startServerCommand: `${startCatalogue} & ${startContent} & wait`,
    },
  },
};
