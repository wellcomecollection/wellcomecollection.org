// @flow

type Props = {|
  data: any
|}

const JsonLd = ({data}: Props) => (
  <script
    type='application/ld+json'
    dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}>
  </script>
);
export default JsonLd;
