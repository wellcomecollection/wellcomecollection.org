type Props = {|
  extraClasses?: string
|}

const Divider = ({extraClasses}: Props) => (
  <hr className={`divider ${extraClasses || ''}`} />
);

export default Divider;
