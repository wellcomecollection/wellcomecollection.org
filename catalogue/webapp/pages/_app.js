// @flow
import React from 'react';
import App, { Container } from 'next/app';

const isServer = typeof window === 'undefined';
const isClient = !isServer;
let toggles = {};

class WecoApp extends App {
  static async getInitialProps({ Component, router, ctx }) {
    toggles = isServer ? router.query.toggles : toggles;

    let pageProps = {};
    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx);
    }

    return { pageProps, toggles: toggles };
  }

  constructor(props) {
    if (isClient && !toggles) { toggles = props.toggles; }

    super(props);
  }

  render () {
    const { Component, pageProps } = this.props;

    return (
      <Container>
        <Component {...pageProps} />
      </Container>
    );
  }
}

export default WecoApp;
