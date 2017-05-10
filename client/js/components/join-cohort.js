import cookie from 'cookie-cutter';

const joinCohort = (el) => {
  el.addEventListener('click', (event) => {
    const cohort = event.target.getAttribute('data-cohort');
    cookie.set('WC_featuresCohort', cohort, {path: '/', expires: 'Fri, 31 Dec 2036 23:59:59 GMT'});
  });
};

export default joinCohort;
