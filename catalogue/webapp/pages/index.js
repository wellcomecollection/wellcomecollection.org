import {Component} from 'react';
import fetch from 'isomorphic-unfetch';
import ButtonButton from '@weco/common/views/components/Buttons/ButtonButton/ButtonButton';

class Index extends Component {
  constructor(props) {
    super(props);
    this.state = props;
  }

  async search(e) {
    const query = e.target.value;
    this.setState({query});
    const res = await fetch(`https://api.wellcomecollection.org/catalogue/v1/works?query=${query}`);
    const json = await res.json();
    this.setState({
      works: json
    });
  }

  render() {
    return (
      <div>
        <h1>WeCo catalogue</h1>
        <h2>{this.state.works.totalResults}</h2>
        <input type='text' value={this.state.query} onChange={(e) => this.search(e)} />
        <ButtonButton text={'things that go kapow'} />
      </div>
    )
  }
}

Index.getInitialProps = async ({ req }) => {
  const res = await fetch(`https://api.wellcomecollection.org/catalogue/v1/works`);
  const json = await res.json();
  return { works: json, query: '' };
};

export default Index
