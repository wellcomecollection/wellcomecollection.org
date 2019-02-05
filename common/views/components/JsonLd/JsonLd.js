// @flow
export type JsonLdObj = { '@type': string };
type Props = {
  data: JsonLdObj | JsonLdObj[],
};

const JsonLd = ({ data }: Props) => {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
};

export default JsonLd;
