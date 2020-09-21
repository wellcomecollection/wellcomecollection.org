// @flow
import Header from '../components/Header';
const fontFamily = 'Gadget, sans-serif';

const IndexPage = () => {
  return (
    <div
      style={{
        fontFamily,
      }}
    >
      <Header title={'Dashboard'} />
      <div
        style={{
          maxWidth: '600px',
          margin: '0 auto',
        }}
      >
        <h1>Wellcome Collection</h1>
        <ul>
          <li>
            <a href="https://wellcomecollection.org" rel="website">
              Website
            </a>
          </li>
          <li>
            <a
              href="https://github.com/wellcomecollection/wellcomecollection.org"
              rel="repo"
            >
              Experience Github repo
            </a>
          </li>
          <li>
            <a href="https://github.com/wellcomecollection/platform" rel="repo">
              Platform GitHub repo
            </a>
          </li>
          <li>
            <a
              href="https://cardigan.wellcomecollection.org"
              rel="design-system"
            >
              Cardigan, our design system
            </a>
          </li>
          <li>
            <a
              href="https://developers.wellcomecollection.org"
              rel="developers-site"
            >
              Developers site
            </a>
          </li>
          <li>
            <a href="https://stacks.wellcomecollection.org/" rel="blog">
              Stacks, our blog
            </a>
          </li>
          <li>
            <a href="https://dash.wellcomecollection.org/bundles/content.browser.latest.html">
              Content app bundle size
            </a>
          </li>
          <li>
            <a href="https://dash.wellcomecollection.org/bundles/catalogue.browser.latest.html">
              Catalogue app bundle size
            </a>
          </li>
          <li>
            <a
              href="http://ghp.wellcomecollection.org/speedtracker/"
              rel="performance"
            >
              Speedtrack performance monitoring
            </a>
          </li>
          <li>
            <a href="https://updown.io/2cep" rel="uptime">
              Uptime: Homepage
            </a>
          </li>
          <li>
            <a href="https://updown.io/5t1q" rel="uptime">
              Uptime: Stories
            </a>
          </li>
          <li>
            <a href="https://updown.io/bhef" rel="uptime">
              Uptime: Works
            </a>
          </li>
          <li>
            <a href="https://stats.uptimerobot.com/x6RyoIGYR" rel="uptime">
              Uptime: Whole site, no cache
            </a>
          </li>
          <li>
            <a
              href="https://wellcomecollection.org/works/progress"
              rel="progress"
            >
              Catalogue search progress notes
            </a>
          </li>
          <li>
            <a href="https://docs.google.com/spreadsheets/d/1wArVKfs9UCSy4LAJWsjY51Hjj-6MK5I42biRhM4kHmg/edit?pli=1#gid=0">
              Digital Engagement Indicators
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default IndexPage;
