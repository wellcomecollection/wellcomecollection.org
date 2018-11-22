// @flow

export type JsonLdType = { '@type': string }

type Props = {|
  data: JsonLdType
|}

const JsonLd = ({
  data
}: Props) => {
  return (
    <script
      type='application/ld+json'
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}>
    </script>
  );
};

export default JsonLd;
