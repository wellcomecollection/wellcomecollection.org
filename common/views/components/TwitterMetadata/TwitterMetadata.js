// @flow
import {Fragment} from 'react';
type Props = {|
  title: string,
  description: string,
  url: string,
  imageUrl: string,
  imageAltText: string,
|}

const TwitterMetadata = ({
  title,
  description,
  url,
  imageUrl,
  imageAltText
}: Props) => (
  <Fragment>
    <meta key='twitter:card' name='twitter:card' content='summary_large_image' />
    <meta key='twitter:site' name='twitter:site' content='@ExploreWellcome' />
    <meta key='twitter:url' name='twitter:url' content={url} />
    <meta key='twitter:title' name='twitter:title' content={title} />
    <meta key='twitter:description' name='twitter:description' content={description} />
    <meta key='twitter:image' name='twitter:image' content={imageUrl} />
    <meta name='twitter:image:alt' content={imageAltText} />
  </Fragment>
);
export default TwitterMetadata;
