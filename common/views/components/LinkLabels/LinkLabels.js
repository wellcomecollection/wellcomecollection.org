// @flow
import { font, classNames } from '../../../utils/classnames';
// $FlowFixMe (tsx)
import Icon from '../Icon/Icon';
// $FlowFixMe (tsx)
import Space from '../styled/Space';
import styled from 'styled-components';

type ItemProps = {|
  url: ?string,
  text: string,
|};

type Props = {|
  items: ItemProps[],
  heading?: string,
  icon?: string,
|};

const ItemText = styled(Space).attrs(props => ({
  as: props.url ? 'a' : 'span',
  href: props.url || undefined,
  h: {
    size: 's',
    properties: [
      'margin-right',
      props.addBorder ? 'padding-left' : undefined,
    ].filter(Boolean),
  },
  className: classNames({
    [`${font('hnr', 5)}`]: true,
    'border-left-width-1 border-color-marble': props.addBorder,
  })
}))``;

const LinkLabels = ({ items, heading, icon }: Props) => (
  heading ? (
    <dl
      className={classNames({
        flex: true,
        'flex--wrap': true,
        'no-margin': true,
        [font('hnb', 5)]: true,
      })}>
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
      {items.map(({ url, text }, i) => (
        <dd
          key={`${url || text}-${i}`}
          className={classNames({
            'no-margin': true,
          })}
        >
          <ItemText url={url} addBorder={i !== 0}>{text}</ItemText>
        </dd>
      ))}
    </dl>
  ) : (
    <ul className={classNames({
      flex: true,
      'plain-list': true,
      'flex--wrap': true,
      'no-margin': true,
      'no-padding': true,
      [font('hnb', 5)]: true,
    })}>
      {items.map(({ url, text }, i) => (
        <li
          key={`${url || text}-${i}`}
          className={classNames({
            'no-margin': true,
          })}>
            <ItemText url={url} addBorder={i !== 0}>{text}</ItemText>
        </li>
      ))}
    </ul>
  )
);

export default LinkLabels;
