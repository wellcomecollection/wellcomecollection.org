type Props = {|
  text: string,
  icon?: Icon,
  onClick?: () => void
|}

const PrimaryCTA = ({ text, icon, onClick }: Props) => (
  <button onClick={onClick}>
    {icon}
    {text}
  </button>
);

export default PrimaryCTA;
