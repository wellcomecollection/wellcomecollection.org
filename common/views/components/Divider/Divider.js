type Props = {|
  extraClasses?: string
|}

export default ({modifiers, extraClasses = []}) => (
  <hr className={`divider ${extraClasses}`} />
);
