// Leave this service with common requires as it's needed where we don't have
// compilation
const { Strategy, initialize } = require('unleash-client');

class ActiveForUserInCohort extends Strategy {
  constructor() {
    super('ActiveForUserInCohort');
  }

  isEnabled({ cohorts }, { cohort }) {
    return cohorts.split(',').indexOf(cohort) !== -1;
  }
}

function init(options) {
  return initialize(Object.assign(options, {
    url: 'https://weco-feature-flags.herokuapp.com/api/',
    refreshInterval: 60 * 1000,
    strategies: [new ActiveForUserInCohort()]
  }));
}

module.exports = {
  initialize: init,
  ActiveForUserInCohort
};
