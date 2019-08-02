// @flow
import { Fragment } from 'react';
import { font, classNames } from '../../../utils/classnames';
import PrismicHtmlBlock from '../PrismicHtmlBlock/PrismicHtmlBlock';
import Icon from '../Icon/Icon';
import type { Element } from 'react';
import type { LabelField } from '../../../model/label-field';
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
        className={classNames({
          'bg-yellow': true,
          'padding-left-12 padding-right-12': true,
        })}
      >
        {items.map(({ title, description, icon }, i) => (
          <Fragment key={i}>
            <div className={font('hnm', 4)}>
              {icon && (title || description) && (
                <span className={`float-l margin-right-6`}>
                  <Icon name={icon} />
                </span>
              )}
              {title && (
                <h3 className={classNames([font('hnm', 5)])}>{title}</h3>
              )}
              {description && (
                <Space
                  v={{
                    size: 'm',
                    properties: ['margin-bottom'],
                  }}
                  className={classNames({
                    [font('hnl', 5)]: true,
                    'first-para-no-margin': true,
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
