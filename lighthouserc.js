const startCatalogue = 'yarn workspace @weco/catalogue run start 3000';
const startContent = 'yarn workspace @weco/content run start 3001';

module.exports = {
  ci: {
    collect: {
      startServerCommand: `${startCatalogue} && ${startContent}`,
    },
  },
};
