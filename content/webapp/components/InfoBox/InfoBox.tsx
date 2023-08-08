import React, { FunctionComponent, PropsWithChildren } from 'react';
import styled from 'styled-components';
import { font } from '@weco/common/utils/classnames';
import PrismicHtmlBlock from '@weco/common/views/components/PrismicHtmlBlock/PrismicHtmlBlock';
import Icon from '@weco/common/views/components/Icon/Icon';
import { LabelField } from '@weco/common/model/label-field';
import Space from '@weco/common/views/components/styled/Space';
import { IconSvg } from '@weco/common/icons';

type InfoBoxItem = LabelField & {
  icon?: IconSvg;
};

type Props = PropsWithChildren<{
  title: string;
  items: InfoBoxItem[];
}>;

const InfoContainer = styled(Space).attrs({
  v: { size: 'l', properties: ['padding-top', 'padding-bottom'] },
  h: { size: 'l', properties: ['padding-left', 'padding-right'] },
})`
  background-color: ${props => props.theme.color('yellow')};
`;

const InfoIconWrapper = styled(Space).attrs({
  h: { size: 's', properties: ['margin-right'] },
  className: font('intb', 4),
})`
  float: left;
`;

const InfoBox: FunctionComponent<Props> = ({ title, items, children }) => {
  return (
    <>
      <h2 className={font('wb', 3)}>{title}</h2>
      <InfoContainer>
        {items.map(({ title, description, icon }, i) => (
          <div key={i}>
            {icon && (title || description) && (
              <InfoIconWrapper>
                <Icon icon={icon} />
              </InfoIconWrapper>
            )}
            {title && <h3 className={font('intb', 5)}>{title}</h3>}
            {description && (
              <Space
                v={{ size: 'm', properties: ['margin-bottom'] }}
                className={font('intr', 5)}
              >
                <PrismicHtmlBlock html={description} />
              </Space>
            )}
          </div>
        ))}
        {children}
      </InfoContainer>
    </>
  );
};

export default InfoBox;
