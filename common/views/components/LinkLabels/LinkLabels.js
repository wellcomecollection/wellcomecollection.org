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
    'border-left-width-1 border-color-marble': i !== 0,
    [spacing({ s: 1 }, { padding: ['left'] })]: i !== 0,
    [spacing({ s: 1 }, { margin: ['right'] })]: true,
  });
}
const LinkLabels = ({ items, heading, icon }: Props) => (
  <dl
    className={classNames({
      flex: true,
      'flex--wrap': true,
      'no-margin': true,
      [font({ s: 'HNL4' })]: true,
    })}
  >
    {heading && (
      <dt
        className={classNames({
          flex: true,
          [spacing({ s: 1 }, { margin: ['right'] })]: true,
          [spacing({ s: 0 }, { margin: ['left', 'top', 'bottom'] })]: true,
        })}
      >
        {icon && (
          <Icon
            name={icon}
            extraClasses={classNames({
              [spacing({ s: 1 }, { margin: ['right'] })]: true,
            })}
          />
        )}
        {heading}
      </dt>
    )}
    {items.map(({ url, text }, i) => (
      <dd
        key={url || text}
        className={classNames({
          'no-margin': true,
        })}
      >
        {url ? (
          <a className={getClassName(i)} href={url}>
            {text}
          </a>
        ) : (
          <span className={getClassName(i)}>{text}</span>
        )}
      </dd>
    ))}
  </dl>
);

export default LinkLabels;
