// @flow
import type {Node} from 'react';
import {Fragment} from 'react';
import Head from 'next/head';
import OpenGraphMetadata from '../OpenGraphMetadata/OpenGraphMetadata';
import TwitterMetadata from '../TwitterMetadata/TwitterMetadata';

type Props = {|
  title: string,
  description: string,
  url: string,
  jsonLd: { '@type': string },
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
  openGraphType,
  imageUrl,
  imageAltText,
  oEmbedUrl,
  children
}: Props) => {
  const fullTitle = title !== ''
    ? `${title} | Wellcome Collection`
    : 'Wellcome Collection | The free museum and library for the incurably curious';
  const absoluteUrl = `https://wellcomecollection.org${url}`;
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
      </Head>

      {children}
    </Fragment>
  );
};
export default PageLayout;
