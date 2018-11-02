// @flow
import { Component, Fragment } from 'react';
import {withRouter} from 'next/router';
import { getWorks as getWorksV1 } from '../services/catalogue/worksV1';
import { getWorks as getWorksV2 } from '../services/catalogue/worksV2';
const defaultQueries = [
  'science',
  'botany',
  'quack+OR+quacks',
  'optics',
  'sun',
  'james+gillray',
  'creators:"AndrÃ©. Just"',

  'creators:J. Thomson',
  'brain',
  'anatomy',
  'bills of mortality',
  'cholera',
  'heart',
  'witch',
  'plague',
  'alchemy',
  'manchu',
  'skull',
  'syphilis',
  'china',
  'tuberculosis',
  'eye',
  'surgery'
];

type Props = {|
  query: ?string,
  router: any
|}
type State = {|
  query: ?string,
  results: any
|}

async function getResults(query: string) {
  const v1ResultsPromise = getWorksV1({query, page: 1});
  const v2ResultsPromise = getWorksV2({query, page: 1});
  const [v1Results, v2Results] = await Promise.all([v1ResultsPromise, v2ResultsPromise]);

  return {v1Results, v2Results};
}

const SearchResults = (response: any) => {
  return (
    <ul>
      <li>{response.totalResults}</li>
      {response.results.map(result => (
        <li key={result.id}>
          <h1>{result.title}</h1>
        </li>
      ))}
    </ul>
  );
};

class V1vsV2 extends Component<Props, State> {
  state = {
    query: this.props.query,
    results: null
  }

  handleChange = (event: any) => {
    const {router} = this.props;
    const query = event.target.value;
    const href = `/v1-vs-v2?query=${query}`;
    const as = `/works${href}`;
    router.push(href, as, { shallow: true });
  };

  async componentDidUpdate(prevProps) {
    const { query } = this.props.router;
    this.setState({query});

    if (query) {
      const results = await getResults(query.query);
      this.setState({ results });
    }
  }

  render() {
    const { results } = this.props;
    return (
      <Fragment>
        <form>
          <input
            type='search'
            name='query'
            value={this.state.query || ''}
            onChange={this.handleChange}
            style={{width: '100%', border: '1px solid grey'}} />
        </form>
        {results && <Fragment>
          <SearchResults {...results.v1Results} />
          <hr />
          <SearchResults {...results.v2Results} />
        </Fragment>}
      </Fragment>
    );
  }
}

V1vsV2.getInitialProps = async (context) => {
  const {query} = context.query;
  if (query) {
    const v1Results = await getWorksV1({query, page: 1});
    const v2Results = await getWorksV2({query, page: 1});
    return {v1Results, v2Results};
  }
  return {query};
};

export default withRouter(V1vsV2);
