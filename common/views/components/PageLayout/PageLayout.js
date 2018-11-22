// @flow
import type {Node} from 'react';
import type {JsonLdType} from './JsonLd';
import {Component, Fragment} from 'react';
import Head from 'next/head';
import JsonLd from './JsonLd';
import OpenGraphMetadata from './OpenGraphMetadata';
import TwitterMetadata from './TwitterMetadata';

const polyfillFeatures = [
  'default',
  'Array.prototype.find',
  'Array.prototype.includes',
  'WeakMap'
];

type Props = {|
  title: string,
  description: string,
  url: string,
  jsonLd: JsonLdType,
  ogType: 'website',
  oEmbedUrl: ?string,
  imageUrl: ?string,
  imageAltText: ?string,
  children: Node
|}

class PageLayout extends Component<Props> {
  render() {
    const {
      title,
      description,
      url,
      jsonLd,
      ogType,
      imageUrl,
      imageAltText,
      oEmbedUrl,
      children
    } = this.props;
    const absoluteUrl = `https://wellcomecollection.org${url}`;

    return (
      <Fragment>
        <Head>
          <meta charSet='utf-8' />
          <meta httpEquiv='X-UA-Compatible' content='IE=edge,chrome=1' />
          <title>{title}</title>
          <link rel='canonical' href={absoluteUrl} />
          <script src={`https://cdn.polyfill.io/v2/polyfill.js?features=${polyfillFeatures.join(',')}`}></script>
          <meta name='viewport' content='width=device-width, initial-scale=1' />
          <meta name='theme-color' content='#000000' />
          <meta name='description' content={description} />
          <link rel='apple-touch-icon' sizes='180x180' href='https://i.wellcomecollection.org/assets/icons/apple-touch-icon.png' />
          <link rel='shortcut icon' href='https://i.wellcomecollection.org/assets/icons/favicon.ico' type='image/ico' />
          <link rel='icon' type='image/png' href='https://i.wellcomecollection.org/assets/icons/favicon-32x32.png' sizes='32x32' />
          <link rel='icon' type='image/png' href='https://i.wellcomecollection.org/assets/icons/favicon-16x16.png' sizes='16x16' />
          <link rel='manifest' href='https://i.wellcomecollection.org/assets/icons/manifest.json' />
          <link rel='mask-icon' href='https://i.wellcomecollection.org/assets/icons/safari-pinned-tab.svg' color='#000000' />
          <script src='https://i.wellcomecollection.org/assets/libs/picturefill.min.js' async />

          <JsonLd data={jsonLd} />

          <OpenGraphMetadata
            type={ogType}
            title={title}
            description={description}
            url={absoluteUrl}
            imageUrl={imageUrl}
          />
          <TwitterMetadata
            title={title}
            description={description}
            url={absoluteUrl}
            imageUrl={imageUrl}
            imageAltText={imageAltText}
          />

          {oEmbedUrl && <link
            rel='alternate'
            type='application/json+oembed'
            href={oEmbedUrl}
            title={title} />}
        </Head>
        {children}
      </Fragment>
    );
  }
}

export default PageLayout;
