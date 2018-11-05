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
    results: null,
    version: 1
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

    if (query && this.state.query !== query.query) {
      if (this.state.version === 1) {
        const results = await getWorksV1({query: query.query, page: 1});
        this.setState({ results, query: query.query });
      } else {
        const results = await getWorksV2({query: query.query, page: 1});
        this.setState({ results, query: query.query });
      }
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
          <label>
            Use V2
            <input
              type='checkbox'
              onChange={(e) => this.setState({ version: e.target.checked ? 2 : 1 })}/>
          </label>
        </form>
        {results && <Fragment>
          <SearchResults {...results.v1Results} />
        </Fragment>}
      </Fragment>
    );
  }
}

export default withRouter(V1vsV2);
