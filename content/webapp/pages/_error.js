import React from 'react';
import ErrorPage from '@weco/common/views/components/ErrorPage/ErrorPage';

export default class Error extends React.Component {
  static getInitialProps({ res, err }) {
    const statusCode = res ? res.statusCode : err ? err.statusCode : null;
    return { statusCode };
  }

  render() {
    const { statusCode } = this.props;
    return statusCode ? (
      <ErrorPage statusCode={this.props.statusCode} />
    ) : (
      <ErrorPage statusCode={500} />
    );
  }
}
