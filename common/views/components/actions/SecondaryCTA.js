import {Fragment} from 'react';
import PrimaryCTA from './PrimaryCTA';

type Props = {|
  primaryCTA: PrimaryCTA,
  text: string,
  icon?: Icon,
  onClick?: () => void
|}

const SecondaryCTA = ({ primaryCTA, text, icon, onClick }: Props) => (
  <Fragment>
    <button onClick={onClick}>
      {icon}
      {text}
    </button>
    {primaryCTA}
  </Fragment>
);

export default SecondaryCTA;
