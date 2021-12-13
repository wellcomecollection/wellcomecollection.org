import React, { Fragment, FunctionComponent } from 'react';
import { font, classNames } from '../../../utils/classnames';
import PrismicHtmlBlock from '../PrismicHtmlBlock/PrismicHtmlBlock';
import Icon from '../Icon/Icon';
import { LabelField } from '../../../model/label-field';
import Space from '../styled/Space';
import { IconSvg } from '../../../icons';

type InfoBoxItem = LabelField & {
  icon?: IconSvg;
};

type Props = {
  title: string;
  items: InfoBoxItem[];
};

const InfoBox: FunctionComponent<Props> = (props: Props) => {
  return (
    <Fragment>
      <h2 className="h2">{props.title}</h2>
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
        {props.items.map(({ title, description, icon }, i) => (
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
        {props.children}
      </Space>
    </Fragment>
  );
};

export default InfoBox;
