// @flow
import { font, classNames } from '../../../utils/classnames';
import Icon from '../Icon/Icon';
import Space from '../styled/Space';

type ItemProps = {|
  url: ?string,
  text: string,
|};

type Props = {|
  items: ItemProps[],
  heading?: string,
  icon?: string,
|};

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
      <Space
        as="dt"
        h={{ size: 's', properties: ['margin-right'] }}
        className={classNames({
          flex: true,
        })}
      >
        {icon && (
          <Space as="span" h={{ size: 's', properties: ['margin-right'] }}>
            <Icon name={icon} />
          </Space>
        )}
        {heading}
      </Space>
    )}
    {items.map(({ url, text }, i) => (
      <dd
        key={`${url || text}-${i}`}
        className={classNames({
          'no-margin': true,
        })}
      >
        {url ? (
          <Space
            h={{
              size: 's',
              properties: [
                'margin-right',
                i !== 0 ? 'padding-left' : undefined,
              ].filter(Boolean),
            }}
            as="a"
            className={classNames({
              [`${font('hnm', 5)}`]: true,
              'border-left-width-1 border-color-marble': i !== 0,
            })}
            href={url}
          >
            {text}
          </Space>
        ) : (
          <Space
            as="span"
            h={{
              size: 's',
              properties: [
                'margin-right',
                i !== 0 ? 'padding-left' : undefined,
              ].filter(Boolean),
            }}
            className={classNames({
              [`${font('hnm', 5)}`]: true,
              'border-left-width-1 border-color-marble': i !== 0,
            })}
          >
            {text}
          </Space>
        )}
      </dd>
    ))}
  </dl>
);

export default LinkLabels;
