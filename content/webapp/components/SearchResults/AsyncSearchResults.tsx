import { Component, Fragment } from 'react';
import SearchResults from './SearchResults';
import { grid } from '@weco/common/utils/classnames';
import Space from '@weco/common/views/components/styled/Space';
import { fetchMultiContentClientSide } from '../../services/prismic/fetch/multi-content';
import { MultiContent } from '../../types/multi-content';

type Props = {
  title?: string;
  query: string;
};

type State = { items: MultiContent[] };

class AsyncSearchResults extends Component<Props, State> {
  state = {
    items: [],
  };

  async componentDidMount() {
    const multiContentQuery = await fetchMultiContentClientSide(
      this.props.query
    );

    this.setState({ items: multiContentQuery?.results || [] });
  }
  render() {
    return (
      <Fragment>
        {this.props.title && (
          <Space v={{ size: 'l', properties: ['margin-bottom'] }}>
            <div className="grid">
              <div className={grid({ s: 12 })}>
                <h2 className="h2 no-margin">{this.props.title}</h2>
              </div>
            </div>
          </Space>
        )}

        {!(this.state.items && this.state.items.length > 0) && (
          // TODO: this should be display: none until enhanced
          <div
            data-component="ContentListItems"
            className="component-list-placeholder"
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
