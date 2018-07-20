// @flow
import {font, spacing, conditionalClassNames} from '../../../utils/classnames';

type Props = {|
  link: string,
  label: string
|}

function getClassName(i) {
  return conditionalClassNames({
    [`${font({s: 'HNM4'})} plain-link font-green`]: true,
    'border-left-width-1 border-color-smoke': i !== 0,
    [spacing({ s: 1 }, { padding: ['left'] })]: i !== 0,
    [spacing({ s: 1 }, { margin: ['right'] })]: true
  });
}
const LinkLabels = ({ items }: { items: Props[] }) => (
  <ul className={`flex plain-list no-margin no-padding line-height-1`}>
    {items.map(({link, label}, i) => (
      <li key={link}>
        {link
          ? <a className={getClassName(i)} href={link}>{label}</a>
          : <span className={getClassName(i)} >{label}</span>
        }
      </li>
    ))}
  </ul>
);

export default LinkLabels;
