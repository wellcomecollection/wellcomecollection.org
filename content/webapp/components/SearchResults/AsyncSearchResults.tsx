import { Component, ReactElement } from 'react';
import SearchResults from './SearchResults';
import { font, grid } from '@weco/common/utils/classnames';
import Space from '@weco/common/views/components/styled/Space';
import { fetchMultiContentClientSide } from '../../services/prismic/fetch/multi-content';
import { MultiContent } from '../../types/multi-content';

export type Props = {
  title?: string;
  query: string;
};

type State = { items: MultiContent[] };

class AsyncSearchResults extends Component<Props, State> {
  state = {
    items: [],
  };

  async componentDidMount(): Promise<void> {
    // Something happens here that reorders results and I'm not sure that's
    // always useful (see content lists). I dug for a while but am thinking one
    // day we'd use the content API.
    const multiContentQuery = await fetchMultiContentClientSide(
      this.props.query
    );

    this.setState({ items: multiContentQuery?.results.filter(Boolean) || [] });
  }

  render(): ReactElement {
    return (
      <>
        {this.props.title && (
          <Space $v={{ size: 'l', properties: ['margin-bottom'] }}>
            <div className="grid">
              <div className={grid({ s: 12 })}>
                <h2 className={font('wb', 3)} style={{ marginBottom: 0 }}>
                  {this.props.title}
                </h2>
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
      </>
    );
  }
}

export default AsyncSearchResults;
