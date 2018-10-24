// @flow
import {Component, Fragment} from 'react';
import SearchResults from '../SearchResults/SearchResults';
import {grid} from '../../../utils/classnames';
import {search} from '../../../services/prismic/search';
import type {MultiContent} from '../../../model/multi-content';

type Props = {|
  title: ?string,
  query: string
|}

type State = {| items: MultiContent[] |}

class AsyncSearchResults extends Component<Props, State> {
  state = {
    items: []
  }

  async componentDidMount() {
    const searchResponse = await search(null, this.props.query);
    this.setState({ items: searchResponse.results });
  }
  render () {
    return (
      <Fragment>
        <div className='grid'>
          <div className={grid({s: 12})}>
            {this.props.title && <h2 className='h2'>{this.props.title}</h2>}
          </div>
        </div>

        {!(this.state.items && this.state.items.length > 0) &&
          <div
            data-component='ContentListItems'
            className='async-content component-list-placeholder'
            data-endpoint={'/async/search?query=' + encodeURIComponent(this.props.query)}
            data-prefix-endpoint={false}
            data-modifiers={[]}>
          </div>
        }

        {this.state.items && this.state.items.length > 0 && <SearchResults items={this.state.items} />}
      </Fragment>
    );
  }
};

export default AsyncSearchResults;
