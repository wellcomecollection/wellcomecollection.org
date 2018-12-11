// @flow
import type {Node} from 'react';
import type {Url} from '../../../model/url';
import type {JsonLdObj} from '../JsonLd/JsonLd';
import {Fragment} from 'react';
import Head from 'next/head';
import convertUrlToString from '../../../utils/convert-url-to-string';
import OpenGraphMetadata from '../OpenGraphMetadata/OpenGraphMetadata';
import TwitterMetadata from '../TwitterMetadata/TwitterMetadata';
import JsonLd from '../JsonLd/JsonLd';

type Props = {|
  title: string,
  description: string,
  url: Url,
  jsonLd: JsonLdObj | JsonLdObj[],
  openGraphType: | 'website' | 'article' | 'book' | 'profile',
  imageUrl: ?string,
  imageAltText: ?string,
  oEmbedUrl?: string,
  children: Node
|}

const PageLayout = ({
  title,
  description,
  url,
  jsonLd,
  openGraphType,
  imageUrl,
  imageAltText,
  oEmbedUrl,
  children
}: Props) => {
  const urlString = convertUrlToString(url);
  const fullTitle = title !== ''
    ? `${title} | Wellcome Collection`
    : 'Wellcome Collection | The free museum and library for the incurably curious';

  const absoluteUrl = `https://wellcomecollection.org${urlString}`;
  return (
    <Fragment>
      <Head>
        <title>{fullTitle}</title>
        <meta name='description' content={description || ''} />
        <link rel='canonical' href={absoluteUrl} />
        {imageUrl && <meta property='og:image' content={imageUrl} />}
        {oEmbedUrl && <link
          rel='alternate'
          type='application/json+oembed'
          href={oEmbedUrl}
          title={title} />}

        <OpenGraphMetadata
          type={openGraphType}
          title={title}
          description={description}
          url={absoluteUrl}
          imageUrl={imageUrl || ''}
        />

        <TwitterMetadata
          title={title}
          description={description}
          url={absoluteUrl}
          imageUrl={imageUrl || ''}
          imageAltText={imageAltText || ''}
        />

        <JsonLd data={jsonLd} />
      </Head>

      {children}
    </Fragment>
  );
};
export default PageLayout;
