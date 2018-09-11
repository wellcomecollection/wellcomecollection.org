// @flow
import {Component, Fragment} from 'react';
import fetch from 'isomorphic-unfetch';
import type {Node} from 'react';
import {grid} from '../../../utils/classnames';

type Props = {|
  title: ?string,
  query: string
|}

type State = {| FetchedComponent: ?Node |}

class AsyncSearchResults extends Component<Props, State> {
  state = {
    FetchedComponent: null
  }

  async componentDidMount() {
    const url = `/async/search?query=${encodeURIComponent(this.props.query)}`;
    const componentHtml = await fetch(url).then(resp => resp.json()).then(json => json.html);
    const Comp = <div dangerouslySetInnerHTML={{__html: componentHtml}}></div>;
    this.setState({FetchedComponent: Comp});
  }
  render () {
    return (
      <Fragment>
        <div className='grid'>
          <div className={grid({s: 12})}>
            <h2 className='h2'>{this.props.title}</h2>
          </div>
        </div>

        {!this.state.FetchedComponent &&
          <div
            data-component='ContentListItems'
            className='async-content component-list-placeholder'
            data-endpoint={'/async/search?query=' + encodeURIComponent(this.props.query)}
            data-prefix-endpoint={false}
            data-modifiers={[]}>
          </div>
        }
        {this.state.FetchedComponent}
      </Fragment>
    );
  }
};

export default AsyncSearchResults;
