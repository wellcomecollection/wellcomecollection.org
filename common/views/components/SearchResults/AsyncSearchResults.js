// @flow
import { Component, Fragment } from 'react';
import SearchResults from '../SearchResults/SearchResults';
import { grid } from '../../../utils/classnames';
import { search } from '../../../services/prismic/search';
import type { MultiContent } from '../../../model/multi-content';
import VerticalSpace from '../styled/VerticalSpace';

type Props = {|
  title: ?string,
  query: string,
|};

type State = {| items: MultiContent[] |};

class AsyncSearchResults extends Component<Props, State> {
  state = {
    items: [],
  };

  async componentDidMount() {
    const searchResponse = await search(null, this.props.query);
    this.setState({ items: searchResponse.results });
  }
  render() {
    return (
      <Fragment>
        {this.props.title && (
          <VerticalSpace size="l">
            <div className="grid">
              <div className={grid({ s: 12 })}>
                <h2 className="h2 no-margin">{this.props.title}</h2>
              </div>
            </div>
          </VerticalSpace>
        )}

        {!(this.state.items && this.state.items.length > 0) && (
          <div
            data-component="ContentListItems"
            className="async-content component-list-placeholder"
            data-endpoint={
              '/async/search?query=' + encodeURIComponent(this.props.query)
            }
            data-prefix-endpoint={false}
            data-modifiers={[]}
          />
        )}

        {this.state.items && this.state.items.length > 0 && (
          <SearchResults items={this.state.items} />
        )}
      </Fragment>
    );
  }
}

export default AsyncSearchResults;
