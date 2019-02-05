// @flow
import {font, spacing, conditionalClassNames, classNames} from '../../../utils/classnames';

type ItemProps = {|
  url: ?string,
  text: string
|}

type Props = {|
  items: ItemProps[],
  heading?: string
|}

function getClassName(i) {
  return conditionalClassNames({
    [`${font({s: 'HNM4'})}`]: true,
    'border-left-width-1 border-color-smoke': i !== 0,
    [spacing({ s: 1 }, { padding: ['left'] })]: i !== 0,
    [spacing({ s: 1 }, { margin: ['right'] })]: true
  });
}
const LinkLabels = ({ items, heading }: Props) => (
  <div className={classNames({
    'flex': true,
    'flex--h-baseline': true,
    [font({s: 'HNL4'})]: true
  })}>
    {heading && <span className={classNames({
      [spacing({ s: 1 }, { margin: ['right'] })]: true
    })}>{heading}</span>}
    <ul className={classNames({
      'flex': true,
      'plain-list': true,
      'no-margin': true,
      'no-padding': true,
      'line-height-1': true
    })}>
      {items.map(({url, text}, i) => (
        <li key={url || text}>
          {url
            ? <a className={getClassName(i)} href={url}>{text}</a>
            : <span className={getClassName(i)} >{text}</span>
          }
        </li>
      ))}
    </ul>
  </div>
);

export default LinkLabels;
