// @flow
import {
  font,
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
    [`${font('hnm', 5)}`]: true,
    'border-left-width-1 border-color-marble': i !== 0,
    'padding-left-6': i !== 0,
    'margin-right-6': true,
  });
}
const LinkLabels = ({ items, heading, icon }: Props) => (
  <dl
    className={classNames({
      flex: true,
      'flex--wrap': true,
      'no-margin': true,
      [font('hnl', 5)]: true,
    })}
  >
    {heading && (
      <dt
        className={classNames({
          flex: true,
          'margin-right-6': true,
        })}
      >
        {icon && (
          <Icon
            name={icon}
            extraClasses={classNames({
              'margin-right-6': true,
            })}
          />
        )}
        {heading}
      </dt>
    )}
    {items.map(({ url, text }, i) => (
      <dd
        key={`${url || text}-${i}`}
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
