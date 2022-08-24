import React, { Fragment, FC, ReactNode } from 'react';
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
  children: ReactNode;
};

const InfoBox: FC<Props> = ({ title, items, children }) => {
  return (
    <>
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
            <div className={font('intb', 4)}>
              {icon && (title || description) && (
                <Space
                  h={{ size: 's', properties: ['margin-right'] }}
                  className={`float-l`}
                >
                  <Icon icon={icon} />
                </Space>
              )}
              {title && (
                <h3 className={classNames([font('intb', 5)])}>{title}</h3>
              )}
              {description && (
                <Space
                  v={{
                    size: 'm',
                    properties: ['margin-bottom'],
                  }}
                  className={classNames({
                    [font('intr', 5)]: true,
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
    </>
  );
};

export default InfoBox;
