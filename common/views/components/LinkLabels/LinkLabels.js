// @flow
import {font, spacing, conditionalClassNames} from '../../../utils/classnames';

type ItemProps = {|
  url: string,
  text: string
|}

type Props = {|
  items: ItemProps[]
|}

function getClassName(i) {
  return conditionalClassNames({
    [`${font({s: 'HNM4'})} plain-link font-green`]: true,
    'border-left-width-1 border-color-smoke': i !== 0,
    [spacing({ s: 1 }, { padding: ['left'] })]: i !== 0,
    [spacing({ s: 1 }, { margin: ['right'] })]: true
  });
}
const LinkLabels = ({ items }: Props) => (
  <ul className={`flex plain-list no-margin no-padding line-height-1`}>
    {items.map(({url, text}, i) => (
      <li key={url}>
        {url
          ? <a className={getClassName(i)} href={url}>{text}</a>
          : <span className={getClassName(i)} >{text}</span>
        }
      </li>
    ))}
  </ul>
);

export default LinkLabels;
