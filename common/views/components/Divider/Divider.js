type Props = {|
  extraClasses?: string
|}

export default ({extraClasses}) => (
  <hr className={`divider ${extraClasses || ''}`} />
);
