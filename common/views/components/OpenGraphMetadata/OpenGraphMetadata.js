// @flow
type GenericProps = {|
  type: 'website' | 'article' | 'book' | 'profile',
  title: string,
  description: string,
  url: string,
  imageUrl: string,
|};
export type OgWebsite = {|
  ...GenericProps,
  type: 'website',
|};
export type OgProfile = {|
  ...GenericProps,
  type: 'profile',
  first_name: OgProfile[],
  username: string,
  // Let's not use this, it's crap, but it is defined in the spec
  // see: http://ogp.me/#type_profile
  gender: 'male' | 'female',
|};
export type OgArticle = {|
  ...GenericProps,
  type: 'article',
  modified_time: Date,
  expiration_time: ?Date,
  author: OgProfile[],
  section: ?string,
  tag: ?(string[]),
|};
export type OgBook = {|
  ...GenericProps,
  type: 'book',
  author: OgProfile[],
  isbn: string,
  release_date: Date,
  tag: ?(string[]),
|};
type Props = GenericProps;
// type Props =
//   | OgWebsite
//   | OgProfile
//   | OgArticle
//   | OgBook;
const OpenGraphMetaData = (props: Props) => {
  const { type, title, description, url, imageUrl } = props;
  return (
    <>
      <meta property="og:site_name" content="Wellcome Collection" />
      <meta property="og:type" content={type} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      {/* we add itemprop="image" as it's required for WhatsApp */}
      {imageUrl && (
        <meta
          key="og:image"
          property="og:image"
          content={imageUrl}
          itemProp="image"
        />
      )}
      {imageUrl && (
        <meta key="og:image:width" property="og:image:width" content="1200" />
      )}
      {/* Object.keys(typeProps).map(key => {
        return  (
          <meta
            key={`og:${type}:${key}`}
            property={`og:${type}:${key}`}
            // For some reason flow allows all keys from all union types here
            // $FlowFixMe
            content={typeProps[key]} />
        );
      }) */}
    </>
  );
};
export default OpenGraphMetaData;
