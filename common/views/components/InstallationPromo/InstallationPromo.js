// @flow
import {spacing, font} from '../../../utils/classnames';

type Props = {|
  id: string,
  title: string
|}

const InstallationPromo = ({ id, title }: Props) => (
  <a
    data-component='InstallationPromo'
    data-track-event={JSON.stringify({
      category: 'component',
      action: 'InstallationPromo:click'
    })}
    id={id}
    href={`/installations/${id}`}
    className='plain-link promo-link bg-cream rounded-corners overflow-hidden flex flex--column'>
    <h2
      className={`
        promo-link__title
        ${font({s: 'WB5'})}
        ${spacing({s: 0}, {margin: ['top']})}
      `}>
      {title}
    </h2>
  </a>
);

export default InstallationPromo;
