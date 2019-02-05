// @flow
import {
  font,
  spacing,
  conditionalClassNames,
  classNames,
} from '../../../utils/classnames';
import Icon from '../Icon/Icon';

type ItemProps = {|
  url: ?string,
  text: string,
|};

type Props = {|
  items: ItemProps[],
  heading?: string,
  icon?: string,
|};

function getClassName(i) {
  return conditionalClassNames({
    [`${font({ s: 'HNM4' })}`]: true,
    'border-left-width-1 border-color-smoke': i !== 0,
    [spacing({ s: 1 }, { padding: ['left'] })]: i !== 0,
    [spacing({ s: 1 }, { margin: ['right'] })]: true,
  });
}
const LinkLabels = ({ items, heading, icon }: Props) => (
  <div
    className={classNames({
      flex: true,
      [font({ s: 'HNL4' })]: true,
    })}
  >
    {heading && (
      <span
        className={classNames({
          flex: true,
          [spacing({ s: 1 }, { margin: ['right'] })]: true,
        })}
      >
        {icon && (
          <span
            className={classNames({
              [spacing({ s: 1 }, { margin: ['right'] })]: true,
            })}
          >
            <Icon name={icon} />
          </span>
        )}
        <span>{heading}</span>
      </span>
    )}
    <ul
      className={classNames({
        flex: true,
        'plain-list': true,
        'no-margin': true,
        'no-padding': true,
        'line-height-1': true,
      })}
    >
      {items.map(({ url, text }, i) => (
        <li key={url || text}>
          {url ? (
            <a className={getClassName(i)} href={url}>
              {text}
            </a>
          ) : (
            <span className={getClassName(i)}>{text}</span>
          )}
        </li>
      ))}
    </ul>
  </div>
);

export default LinkLabels;
