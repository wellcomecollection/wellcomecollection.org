// @flow
import { Fragment } from 'react';
// $FlowFixMe (ts)
import { font, classNames } from '../../../utils/classnames';
import PrismicHtmlBlock from '../PrismicHtmlBlock/PrismicHtmlBlock';
// $FlowFixMe (tsx)
import Icon from '../Icon/Icon';
import type { Element } from 'react';
import type { LabelField } from '../../../model/label-field';
// $FlowFixMe (tsx)
import Space from '../styled/Space';

type Props = {|
  title: string,
  items: {|
    ...LabelField,
    icon?: ?string,
  |}[],
  children: Element<'p'>,
|};

const InfoBox = ({ title, items, children }: Props) => {
  return (
    <Fragment>
      <h2 className="h2">{title}</h2>
      <Space
        v={{
          size: 'l',
          properties: ['padding-top', 'padding-bottom'],
        }}
        h={{ size: 'l', properties: ['padding-left', 'padding-right'] }}
        className={classNames({
          'bg-yellow': true,
        })}
      >
        {items.map(({ title, description, icon }, i) => (
          <Fragment key={i}>
            <div className={font('hnb', 4)}>
              {icon && (title || description) && (
                <Space
                  h={{ size: 's', properties: ['margin-right'] }}
                  className={`float-l`}
                >
                  <Icon icon={icon} />
                </Space>
              )}
              {title && (
                <h3 className={classNames([font('hnb', 5)])}>{title}</h3>
              )}
              {description && (
                <Space
                  v={{
                    size: 'm',
                    properties: ['margin-bottom'],
                  }}
                  className={classNames({
                    [font('hnr', 5)]: true,
                  })}
                >
                  <PrismicHtmlBlock html={description} />
                </Space>
              )}
            </div>
          </Fragment>
        ))}
        {children}
      </Space>
    </Fragment>
  );
};

export default InfoBox;
