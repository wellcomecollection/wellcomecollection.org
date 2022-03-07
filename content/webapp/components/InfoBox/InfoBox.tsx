import React, { Fragment, FunctionComponent, ReactElement } from 'react';
import { font, classNames } from '@weco/common/utils/classnames';
import PrismicHtmlBlock from '@weco/common/views/components/PrismicHtmlBlock/PrismicHtmlBlock';
import Icon from '@weco/common/views/components/Icon/Icon';
import { LabelField } from '@weco/common/model/label-field';
import Space from '@weco/common/views/components/styled/Space';
import { IconSvg } from '@weco/common/icons';

type InfoBoxItem = LabelField & {
  icon?: IconSvg;
};

type Props = {
  title: string;
  items: InfoBoxItem[];
  children: ReactElement<'p'>;
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
